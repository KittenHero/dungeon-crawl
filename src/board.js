class Board {
	constructor({ sprites=SPRITE_DATA, width=41, height=41, room_min=3, room_max=9, floor_percentile=0.5} = {}) {
		this.sprites = sprites
		this.width = width
		this.height = height
		this.room_min = room_min
		this.room_max = room_max
		this.floor_percentile = floor_percentile

		this.anim_cycle = 0.15
		this.anim_timer = 0

		this.init_board()
	}

	init_board() {
		this.cells = new Array(this.width * this.height).fill(Board.celltype.empty)
		let remain = this.width * this.height * this.floor_percentile | 0
		for (let tries = 0; remain > 0 && tries < 0xffff; ++tries)
			remain -= this.place_room()

		this.connect_rooms()
		this.place_exit()
		this.place_items()

		this.prerender()
	}

	static get celltype() {
		const r    = 0b000001
		const n    = 0b000010
		const s    = 0b000100
		const w    = 0b001000
		const e    = 0b010000
		const exit = 0b100000
		return {
			exit : r | exit,  empty : 0,
		    r    : r,         path  : n | s | w | e,
			n    : n | r,     s     : s | r,
			w    : w | r,     e     : e | r,
			nw   : n | w | r, ne    : n | e | r,
			sw   : s | w | r, se    : s | e | r
		}
	}

	static get itemtype() {
		return { health : 1, weapon: 2 }
	}

	update(dt, input) {
		if (this.player.state !== Player.state.accept) {
			this.anim_timer += dt
			if (this.anim_timer >= this.anim_cycle) {
				this.anim_timer = 0
				this.player.state = Player.state.accept
				this.player.x = Math.round(this.player.x)
				this.player.y = Math.round(this.player.y)
				const pos = this.player.x + this.player.y * this.width
				if (this.cells[pos] === Board.celltype.exit) {
					this.init_board()
				}
			}
		}
		this.player.update({ dtu: dt / this.anim_cycle, input, ...this })
	}

	render(ctx, dt) {
		if (!this.canvas) return
		const { width, height } = ctx.canvas
		const sscl = this.sprites.grid_size
		const scl = sscl * 2
		const [offset_x, offset_y] = [
			0.5*width  - scl*this.player.x,
			0.5*height - scl*this.player.y
		]

		const spritefrom = itemtype => {
			switch (itemtype) {
			case Board.itemtype.weapon:
			case Board.itemtype.health:
				return this.sprites.health
			}
		}

		ctx.drawImage(this.canvas, 0, 0, 8, 8, 0, 0, width, height)

		ctx.save()
		ctx.translate(offset_x, offset_y)
		ctx.scale(scl, scl)

		ctx.drawImage(
			this.canvas, 0, 0, sscl * this.width, sscl * this.height,
			0, 0, this.width, this.height
		)
		const anim_percent = this.anim_timer / this.anim_cycle
		for (const item of this.items) {
			const sprites = this.sprites.health
			const crop = sprites.crop[anim_percent * sprites.crop.length | 0]
			ctx.drawImage(
				sprites.img, crop.x, crop.y, crop.width, crop.height,
				item.pos % this.width, item.pos / this.width | 0, 1, 1
			)
		}
		this.player.render(ctx, anim_percent)
		ctx.restore()
	}

	prerender(img) {
		const sprites = this.sprites.tiles.crop
		const tile_crop = index => {
			switch(this.cells[index]) {
			case Board.celltype.n:
				return sprites.floorn
			case Board.celltype.s:
				return sprites.floors
			case Board.celltype.w:
				return sprites.floorw
			case Board.celltype.e:
				return sprites.floore
			case Board.celltype.nw:
				return sprites.floornw
			case Board.celltype.ne:
				return sprites.floorne
			case Board.celltype.sw:
				return sprites.floorsw
			case Board.celltype.se:
				return sprites.floorse
			case Board.celltype.exit:
				return sprites.exit
			case Board.celltype.path:
				return sprites.path
			case Board.celltype.r:
				return sprites.floor
			case Board.celltype.empty:
				const under = this.cells[index + this.width]
				if (under === undefined || under === Board.celltype.empty)
					return sprites.bg
				else return sprites.wall
			}
		}

		const scl = this.sprites.grid_size
		let canvas = document.createElement('canvas')
		canvas.width = this.width * scl
		canvas.height = this.height * scl

		let ctx = canvas.getContext('2d')
		ctx.scale(scl, scl)
		for (let y = 0; y < this.height; ++y)
		for (let x = 0; x < this.width; ++x) {
			const crop = tile_crop(x + y*this.width)
			ctx.drawImage(
				this.sprites.tiles.img, crop.x, crop.y, crop.width, crop.height,
				x, y, 1, 1
			)
		}
		this.canvas = canvas
	}

	place_room() {
		const [x, y, w, h] = [
			Utils.rand_odd(0, this.width),
			Utils.rand_odd(0, this.height),
			Utils.rand_odd(this.room_min, this.room_max),
			Utils.rand_odd(this.room_min, this.room_max),
		]

		// check if in bounds
		if (x + w > this.width || y + h > this.height)
			return 0
		const start = x + y*this.width

		// check for intersection
		for (const r of this.cells.slice(start - this.width, start - this.width + w))
			if (r !== Board.celltype.empty) return 0;
		for (const r of this.cells.slice(start + h*this.width, start + h*this.width + w))
			if (r !== Board.celltype.empty) return 0;
		for (let j = 0; j < h; ++j) {
			const rstart = start + j*this.width
			if (this.cells[rstart - 1] | this.cells[rstart + w] !== Board.celltype.empty)
				return 0
		}

		let filled = 0
		for (let j = 0; j < h; ++j) {
			const rstart = start + j*this.width
			const rtype = j == 0 ? Board.celltype.n
			        : j + 1 == h ? Board.celltype.s 
							     : Board.celltype.r

			filled += this.cells.slice(rstart, rstart + w)
				.reduce((acc, e) => acc + (e & Board.celltype.r), 0)

			this.cells.fill(rtype, rstart + 1, rstart + w - 1)
			this.cells[rstart] = rtype | Board.celltype.w
			this.cells[rstart + w - 1] = rtype | Board.celltype.e
		}
		return w*h - filled
	}

	place_exit() { 
		const exit = Utils.rchoice(
			this.cells
				.map((e, i) => e === Board.celltype.r ? i : 0)
				.filter(Utils.identity)
		)
		this.cells[exit] = Board.celltype.exit
	}

	place_items() {
		const free = this.cells
			.map((e, i) => e !== Board.celltype.empty ? i : 0)
			.filter(Utils.identity)
		const area = this.cells
			.map(e => !!e)
			.reduce((a, b) => a + b)
		const log_area = Math.log(area, 4)
		const items = this.items = new Array(Utils.rand(log_area, 2 + log_area*2)|0)
			.fill().map(() => ({
				type: Board.itemtype.health,
				health: Utils.rand(20, 100) | 0
			}))

		items.push({ type: Board.itemtype.weapon })
		while (-1 != items.findIndex((itm, i, a) => a.slice(0, i).some(o => itm.pos == o.pos)))
			items.forEach(itm => itm.pos = Utils.rchoice(free))
		this.player = new Player(free.filter(e => !items.find(i => i.pos == e)), this.width, this.sprites.player)
	}

	connect_rooms() {
		const rooms = this.cells
						  .map((r, i) => r === Board.celltype.nw ? i : 0)
						  .filter(Utils.identity)
		const walls = rooms.map(nw => {
			const walls = []
			for (let cur = nw; this.cells[cur] & Board.celltype.n; ++cur)
				walls.push(cur)
			const [ne] = walls.slice(-1)
			const diff = ne - nw
			for (let cur = nw + this.width; this.cells[cur] & Board.celltype.w; cur += this.width)
				walls.push(cur, cur + diff)
			const [sw, se] = walls.slice(-2)
			
			return walls.concat(
				new Array(diff - 1)
				.fill()
				.map((e, i) => i + sw + 1)
			)
		})

		const pathify = index => 
			this.cells[index] = this.cells[index] === Board.celltype.empty ? Board.celltype.path : this.cells[index]

		// form a spanning tree with all rooms
		walls.reduce((big, small) => {
			if (small.some(e => big.includes(e))) return big.concat(small)
			const candidates = []
			for (let path = 2; !candidates.length; path += 2)
			for (const wall of Utils.shuffle(small))
				if (this.cells[wall] & Board.celltype.n && big.includes(wall - path*this.width))
					candidates.push(
						new Array(path).fill()
						.map((e, i) => wall - i*this.width)
						.slice(1)
					)
				else if (this.cells[wall] & Board.celltype.w && (wall%this.width) > path && big.includes(wall - path))
					candidates.push(
						new Array(path).fill()
						.map((e, i) => wall - i)
						.slice(1)
					)
				else if (this.cells[wall] & Board.celltype.e && (wall%this.width) + path < this.width && big.includes(wall + path))
					candidates.push(
						new Array(path).fill()
						.map((e, i) => wall + i)
						.slice(1)
					)
			
			let path = Utils.rchoice(candidates)
			for (const step of path)
				pathify(step)

			return big.concat(small, path)
		})

		for (const room of walls)
		for (let path = 2; ; path = (path + 2) % this.width % this.height) {
			const wall = Utils.rchoice(room)
			if (this.cells[wall] & Board.celltype.n && this.cells[wall - path*this.width] & Board.celltype.r) {
				for (let step = wall - this.width; step > wall - path*this.width; step -= this.width)
					pathify(step)
				break
			} else if (this.cells[wall] & Board.celltype.w && this.cells[wall - path] & Board.celltype.r) {
				for (let step = wall - 1; step > wall - path; --step)
					pathify(step)
				break
			} else if (this.cells[wall] & Board.celltype.e && this.cells[wall + path] & Board.celltype.r) {
				for (let step = wall + 1; step < wall + path; ++step)
					pathify(step)
				break
			} else if (this.cells[wall] & Board.celltype.s && this.cells[wall + path*this.width] & Board.celltype.r) {
				for (let step = wall + this.width; step < wall + path*this.width; step += this.width)
					pathify(step)
				break
			}
		}
	}
}
