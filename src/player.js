class Player {
	static get state() {
		return {
			accept: 0,
			up: 1, down: 2,
			left: 3, right: 4
		}
	}
	constructor(spawnable, width, sprite) {
		const pos = Utils.rchoice(spawnable)
		this.x = pos % width
		this.y = pos / width | 0
		this.dir = 1
		this.state = Player.state.accept
		Object.assign(this, sprite)
	}

	update({ dtu, input, cells, width, items }) {
		switch (this.state) {
		case Player.state.accept:
			const pos = this.x + this.y * width
			if (input.left && cells[pos - 1] !== Board.celltype.empty)
				this.state = Player.state.left
			if (input.right && cells[pos + 1] !== Board.celltype.empty)
				this.state = Player.state.right
			if (input.up && cells[pos - width] !== Board.celltype.empty)
				this.state = Player.state.up
			if (input.down && cells[pos + width] !== Board.celltype.empty)
				this.state = Player.state.down
			return
		case Player.state.left:
			this.x -= dtu
			this.dir = -1
			return
		case Player.state.right:
			this.x += dtu
			this.dir = 1
			return
		case Player.state.up:
			this.y -= dtu
			return
		case Player.state.down:
			this.y += dtu
			return
		}
	}
	render(ctx, anim_percent) {
		const crop = ((state, stage) => {
			switch (state) {
			case Player.state.accept:
				return this.crop.idle
			default:
				const w = this.crop.walk
				return w[stage * w.length | 0]
			}

		})(this.state, anim_percent)
		ctx.save()
		ctx.translate(this.x, this.y)
		ctx.scale(this.dir, 1)
		ctx.drawImage(
			this.img, crop.x, crop.y, crop.width, crop.height,
			0, 0, this.dir, 1
		)
		ctx.restore()
	}
}

