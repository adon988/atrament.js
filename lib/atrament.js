'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//make a class for Point

var Point = function () {
	function Point(x, y) {
		_classCallCheck(this, Point);

		if (arguments.length < 2) throw new Error('not enough coordinates for Point.');
		this._x = x;
		this._y = y;
	}

	_createClass(Point, [{
		key: 'set',
		value: function set(x, y) {
			if (arguments.length < 2) throw new Error('not enough coordinates for Point.set');
			this._x = x;
			this._y = y;
		}
	}, {
		key: 'x',
		get: function get() {
			return this._x;
		},
		set: function set(x) {
			this._x = x;
		}
	}, {
		key: 'y',
		get: function get() {
			return this._y;
		},
		set: function set(y) {
			this._y = y;
		}
	}]);

	return Point;
}();

//make a class for the mouse data


var Mouse = function (_Point) {
	_inherits(Mouse, _Point);

	function Mouse() {
		_classCallCheck(this, Mouse);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Mouse).call(this, 0, 0));

		_this._down = false;
		_this._px = 0;
		_this._py = 0;
		return _this;
	}

	_createClass(Mouse, [{
		key: 'down',
		get: function get() {
			return this._down;
		},
		set: function set(d) {
			this._down = d;
		}
	}, {
		key: 'x',
		get: function get() {
			return this._x;
		},
		set: function set(x) {
			this._x = x;
		}
	}, {
		key: 'y',
		get: function get() {
			return this._y;
		},
		set: function set(y) {
			this._y = y;
		}
	}, {
		key: 'px',
		get: function get() {
			return this._px;
		},
		set: function set(px) {
			this._px = px;
		}
	}, {
		key: 'py',
		get: function get() {
			return this._py;
		},
		set: function set(py) {
			this._py = py;
		}
	}]);

	return Mouse;
}(Point);

var Atrament = function () {
	function Atrament(selector, width, height, color) {
		var _this2 = this;

		_classCallCheck(this, Atrament);

		if (!document) throw new Error('no DOM found');

		//get canvas element
		if (selector instanceof Node && selector.tagName === 'CANVAS') this.canvas = selector;else if (typeof selector === 'string') this.canvas = document.querySelector(selector);else throw new Error('can\'t look for canvas based on \'' + selector + '\'');
		if (!this.canvas) throw new Error('canvas not found');

		//set external canvas params
		this.canvas.width = width ? width : 500;
		this.canvas.height = height ? height : 500;
		this.canvas.style.cursor = 'crosshair';

		//create a mouse object
		this.mouse = new Mouse();

		//mousemove handler
		var mouseMove = function mouseMove(mousePosition) {
			mousePosition.preventDefault();
			//get position
			var mx = void 0,
			    my = void 0;
			if (mousePosition.changedTouches) {
				// touchscreens
				mx = mousePosition.changedTouches[0].pageX - mousePosition.target.offsetLeft;
				my = mousePosition.changedTouches[0].pageY - mousePosition.target.offsetTop;
			} else if (mousePosition.layerX || mousePosition.layerX == 0) {
				// Firefox
				mx = mousePosition.layerX;
				my = mousePosition.layerY;
			} else if (mousePosition.offsetX || mousePosition.offsetX == 0) {
				// Opera
				mx = mousePosition.offsetX;
				my = mousePosition.offsetY;
			};
			//draw if we should draw
			if (_this2.mouse.down) {
				_this2.draw(mx, my);
			}
			//if not, just update position
			else {
					_this2.mouse.x = mx;
					_this2.mouse.y = my;
				}
		};

		//mousedown handler
		var mouseDown = function mouseDown(mousePosition) {
			mousePosition.preventDefault();
			//update position just in case
			mouseMove(mousePosition);
			//remember it
			_this2.mouse.px = _this2.mouse.x;
			_this2.mouse.py = _this2.mouse.y;
			//begin drawing
			_this2.mouse.down = true;
			_this2.context.beginPath();
			_this2.context.moveTo(_this2.mouse.px, _this2.mouse.py);
		};
		var mouseUp = function mouseUp(mousePosition) {
			mousePosition.preventDefault();
			_this2.mouse.down = false;
			//stop drawing
			_this2.context.closePath();
		};

		//attach listeners
		this.canvas.addEventListener('mousemove', mouseMove);
		this.canvas.addEventListener('mousedown', mouseDown);
		this.canvas.addEventListener('mouseup', mouseUp);
		this.canvas.addEventListener('touchstart', mouseDown);
		this.canvas.addEventListener('touchend', mouseUp);
		this.canvas.addEventListener('touchmove', mouseMove);

		//set internal canvas params
		this.context = this.canvas.getContext('2d');
		this.context.globalCompositeOperation = 'source-over';
		this.context.globalAlpha = 1;
		this.context.strokeStyle = color ? color : 'black';
		this.context.lineCap = 'round';
		this.context.lineJoin = 'round';

		//set drawing params
		this.SMOOTHING_INIT = 0.85;
		this.WEIGHT_SPREAD = 10;
		this._smoothing = this.SMOOTHING_INIT;
		this._maxWeight = 12;
		this._thickness = 2;
		this._targetThickness = 2;
		this._weight = 2;
	}

	_createClass(Atrament, [{
		key: 'draw',
		value: function draw(mX, mY) {
			var mouse = this.mouse;
			var context = this.context;

			//calculate distance from previous point
			var raw_dist = Atrament.lineDistance(mX, mY, mouse.px, mouse.py);

			//now, here we scale the initial smoothing factor by the raw distance
			//this means that when the mouse moves fast, there is more smoothing
			//and when we're drawing small detailed stuff, we have more control
			//also we hard clip at 1
			var smoothingFactor = Math.min(0.87, this._smoothing + (raw_dist - 60) / 3000);

			//calculate smoothed coordinates
			mouse.x = mX - (mX - mouse.px) * smoothingFactor;
			mouse.y = mY - (mY - mouse.py) * smoothingFactor;

			//recalculate distance from previous point, this time relative to the smoothed coords
			var dist = Atrament.lineDistance(mouse.x, mouse.y, mouse.px, mouse.py);

			//calculate target thickness based on the new distance
			this._targetThickness = (dist - 1) / (50 - 1) * (this._maxWeight - this._weight) + this._weight;
			//approach the target gradually
			if (this._thickness > this._targetThickness) {
				this._thickness -= 0.5;
			} else if (this._thickness < this._targetThickness) {
				this._thickness += 0.5;
			}
			//set line width
			context.lineWidth = this._thickness;

			//draw using quad interpolation
			context.quadraticCurveTo(mouse.px, mouse.py, mouse.x, mouse.y);
			context.stroke();

			//remember
			mouse.px = mouse.x;
			mouse.py = mouse.y;
		}
	}, {
		key: 'clear',
		value: function clear() {
			//make sure we're in the right compositing mode, and erase everything
			if (this.context.globalCompositeOperation === 'destination-out') {
				this.mode = 'draw';
				this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
				this.mode = 'erase';
			} else {
				this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			}
		}
	}, {
		key: 'toImage',
		value: function toImage() {
			return this.canvas.toDataURL();
		}
	}, {
		key: 'color',
		get: function get() {
			return this.context.strokeStyle;
		},
		set: function set(c) {
			if (typeof c !== 'string') throw new Error('wrong argument type');
			this.context.strokeStyle = c;
		}
	}, {
		key: 'weight',
		get: function get() {
			return this._weight;
		},
		set: function set(w) {
			if (typeof w !== 'number') throw new Error('wrong argument type');
			this._weight = w;
			this._thickness = w;
			this._targetThickness = w;
			this._maxWeight = w + this.WEIGHT_SPREAD;
		}
	}, {
		key: 'mode',
		get: function get() {
			return this.context.globalCompositeOperation === 'destination-out' ? 'erase' : 'draw';
		},
		set: function set(m) {
			if (typeof m !== 'string') throw new Error('wrong argument type');
			this.context.globalCompositeOperation = m === 'erase' ? 'destination-out' : 'source-over';
		}
	}, {
		key: 'smoothing',
		get: function get() {
			return this._smoothing === this.SMOOTHING_INIT;
		},
		set: function set(s) {
			if (typeof s !== 'boolean') throw new Error('wrong argument type');
			this._smoothing = s ? this.SMOOTHING_INIT : 0;
		}
	}, {
		key: 'opacity',
		set: function set(o) {
			if (typeof o !== 'number') throw new Error('wrong argument type');
			//now, we need to scale this, because our drawing method means we don't just get uniform transparency all over the drawn line.
			//so we scale it down a lot, meaning that it'll look nicely semi-transparent
			//unless opacity is 1, then we should go full on to 1
			if (o >= 1) this.context.globalAlpha = 1;else this.context.globalAlpha = o / 10;
		}
	}], [{
		key: 'lineDistance',
		value: function lineDistance(x1, y1, x2, y2) {
			//calculate euclidean distance between (x1, y1) and (x2, y2)
			var xs = 0;
			var ys = 0;

			xs = x2 - x1;
			xs = xs * xs;

			ys = y2 - y1;
			ys = ys * ys;

			return Math.sqrt(xs + ys);
		}
	}]);

	return Atrament;
}();

//for people who like functional programming


function atrament(selector, width, height, color) {
	return new Atrament(selector, width, height, color);
}

module.exports = atrament;
module.exports.Atrament = Atrament;