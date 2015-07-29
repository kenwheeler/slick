
build: components slick/slick.js slick/slick.css
	@component build --dev

components: component.json
	@component install --dev

.PHONY: clean
