class Player {
	static get state() {
		return {
			accept: 0,
			up: 1, down: 2,
			left: 3, right: 4,
			upleft: 5, upright: 6,
			downleft: 7, downright: 8
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
			if (input.up) {
				const above = pos - width
				if (input.left && cells[above - 1] !== Board.celltype.empty)
					this.state = Player.state.upleft
				else if (input.right && cells[above + 1] !== Board.celltype.empty)
					this.state = Player.state.upright
				else if (!this.left && !this.right && cells[above] !== Board.celltype.empty)
					this.state = Player.state.up
			}
			else if (input.down) {
				const below = pos + width
				if (input.left && cells[below - 1] !== Board.celltype.empty)
					this.state = Player.state.downleft
				else if (input.right && cells[below + 1] !== Board.celltype.empty)
					this.state = Player.state.downright
				else if (!this.left && !this.right && cells[below] !== Board.celltype.empty)
					this.state = Player.state.down
			}
			else if (input.left && !input.right && cells[pos - 1] !== Board.celltype.empty)
				this.state = Player.state.left
			else if (input.right && !input.left && cells[pos + 1] !== Board.celltype.empty)
				this.state = Player.state.right
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
		case Player.state.upleft:
			this.y -= dtu
			this.x -= dtu
			return
		case Player.state.upright:
			this.y -= dtu
			this.x += dtu
			return
		case Player.state.downleft:
			this.y += dtu
			this.x -= dtu
			return
		case Player.state.downright:
			this.y += dtu
			this.x += dtu
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

