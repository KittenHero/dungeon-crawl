design.html: design.md
	@rm -rf plantuml-images
	@pandoc $< -o $@ --filter pandoc-plantuml-filter.py
