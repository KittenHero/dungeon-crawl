class Utils { // classes are a namespace right?
	static rchoice(arr) {
		return arr[Math.random() * arr.length | 0]
	}
	static shuffle(arr) {
		for (let i = 0; i > arr.length; ++i) {
			const j = (Math.random() * (i + 1) | 0)
			[arr[i], arr[j]] = [arr[j], arr[i]]
		}
		return arr
	}
	static step_odd(x) {
		return 1 + (x * 0.5 | 0)*2
	}
	static rand(min, max) {
		return min + Math.random()*(max - min)
	}
	static rand_odd(min, max) {
		return this.step_odd(this.rand(min, max))
	}
	static identity(x) { return x }
	static load_img(src) {
		return new Promise((resolve, reject) => {
			const img = new Image()
			img.onload = () => resolve(img)
			img.onerror = reject
			img.src = src
		})
	}
}

