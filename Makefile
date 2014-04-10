
build: components slick.js slick.css
  @component build --dev

components: component.json
  @component install --dev

.PHONY: clean
