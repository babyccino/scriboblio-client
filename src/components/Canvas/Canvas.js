import React from 'react';
import './Canvas.scss';

import { ActionTypes, Tool } from '../../config';
import {
	line,
	getColorIndexForCoord,
	getColorAt,
	compareColorAtHelper,
	setColorHelper,
	getColor,
	distance2,
} from './CanvasUtil';

export default class Canvas extends React.Component {
	minX = null;
	minY = null;
	maxX = null;
	maxY = null;

	inCanvas = false;
	undos = [];
	clear = true;

	imageData = null;
	ctx = null;

	getFullContext = null;

	tool = Tool.pencil;
	
	// override
	componentDidMount() {
		const canvas = this.refs.canvas;

		this.ctx = canvas.getContext('2d');
		this.getFullContext = this.ctx.getImageData.bind(this.ctx, 0, 0,
			this.props.width, this.props.height);

		this.ctx.fillStyle = "white";
		this.ctx.fillRect(0, 0, this.props.width, this.props.height);
		this.ctx.fill();

		document.addEventListener("mouseup", event => {
			const coords = this.getCoords(event);
			if (this.brushDown) this.props.actions.mouseUp(coords);
		}, false);

		canvas.addEventListener("mousedown", event => {
			if (!this.props.isDrawer) return;
			const coords = this.getCoords(event);
			this.props.actions.mouseDown(coords);
		}, false);
		canvas.addEventListener("mouseenter", event => {
			this.inCanvas = true;
			if (this.brushDown) this.props.actions.lastCoords(this.lastCoords);
		}, false);
		document.addEventListener("mousemove", event => {
			const coords = this.getCoords(event);
			if (this.brushDown && this.inCanvas) this.props.actions.mouseMove(coords);
		}, false);
		canvas.addEventListener("mouseout", event => {
			this.inCanvas = false;
			const coords = this.getCoords(event);
			if (this.brushDown) this.props.actions.mouseMove(coords);
		}, false);
	}
	// override
	componentWillReceiveProps(nextProps) {
		if (nextProps.clearCanvas) 			this.clearCanvas();
		else if (nextProps.undo) 				this.undo();
		else if (nextProps.mouseAction)	this.executeMouseAction(nextProps.mouseAction);
	}
	// override
	shouldComponentUpdate = () => false;

	executeMouseAction = action => {
		switch (action.type) {
		case ActionTypes.mouseDown: {
			switch (this.props.tool) {
			case Tool.bucket: return this.bucketFill(action.coords);
			case Tool.pencil:
			case Tool.eraser:
			default: return this.drawPencilStart(action.coords);
			}
		}
		case ActionTypes.mouseMove: return this.drawPencilContinue(action.coords);
		case ActionTypes.mouseUp: 	return this.drawPencilStop(action.coords);
		default: return;
		}
	}
	drawPencilStart = coords => {
		this.addUndo();

		this.inCanvas = true;

		this.lastCoords = coords;

		this.setMinMax(coords);

		this.drawCircle(coords);
		this.clear = false;

		this.brushDown = true;
	}
	drawPencilContinue = coords => {
		this.setMinMax(coords);

		this.drawCircle(coords);
		if (distance2(coords, this.lastCoords) > this.props.stroke.width) {
			this.drawLine(this.lastCoords, coords);
		}

		this.lastCoords = coords;
		this.inCanvas = true;
	}
	drawPencilStop = coords => {
		if (this.brushDown && this.inCanvas) this.drawPencilContinue(coords);
		this.brushDown = false;
	}
	setLastCoords = coords => this.lastCoords = coords;

	// transforms event into coordinates relative to the top left corner of the canvas
	getCoords = event => ({
		x: event.clientX - this.refs.canvas.offsetLeft,
		y: event.clientY - this.refs.canvas.offsetTop,
	});
	setMinMax = coords => {
		const width = this.props.stroke.width,
					{ x, y } = coords;
		if (this.clear) {
			// init min/max if undefined
			this.minX = x - width;
			this.minY = y - width;
			this.maxX = x + width;
			this.maxY = y + width;
		} else {
			if (this.minX > x - width) this.minX = x - width;
			if (this.minY > y - width) this.minY = y - width;
			if (this.maxX < x + width) this.maxX = x + width;
			if (this.maxY < y + width) this.maxY = y + width;
		}
		if (this.minX < 0) this.minX = 0;
		if (this.minY < 0) this.minY = 0;
		if (this.maxX >= this.props.width) this.maxX = this.props.width - 1;
		if (this.maxY >= this.props.height) this.maxY = this.props.height - 1;
	}

	drawLine = ( start, end ) => {
		const { width, height } = this.props;
		const replacementColor = getColor(this.props.stroke.color);
		let imageData = this.getFullContext();
		const pixel = (x, y) => {
			if (x < 0 || y < 0 || x >= width || y >= height) return;
			setColorHelper(imageData.data, x, y, width, replacementColor);
		};
		line(start.x, start.y, end.x, end.y, this.props.stroke.width, pixel);
		this.ctx.putImageData(imageData, 0, 0);
		this.clear = false;
	}
	drawCircle = coord => {
		const { width } = this.props,
					r = Math.ceil(this.props.stroke.width / 2),
					{ x, y } = coord,
					setColor = getColor(this.props.stroke.color);
		let imageData = this.ctx.getImageData(0, 0, this.props.width, this.props.height),
				arr = imageData.data;
		for (let i = x - r + 1 > 0 ? -r + 1 : -x;
		i < r && i < width;
		++i) {
			let iiMax = Math.floor(Math.sqrt(r*r - i*i));
			if (iiMax === r) iiMax -= 1;
			for (let ii = y - iiMax + 1 > 0 ? -iiMax + 1 : -y;
			ii <= iiMax && getColorIndexForCoord(i, ii, width) < arr.length && x + ii < width;
			++ii) {
				setColorHelper(arr, x + ii, y + i, width, setColor);
			}
		}
		this.ctx.putImageData(imageData, 0, 0);
		this.clear = false;
	}

	clearCanvas = () => {
		this.ctx.fillStyle = "white";
		this.ctx.fillRect(0, 0, this.props.width, this.props.height);
		this.ctx.fill();
	}

	addUndo = () => {
		let imgData;
		if (this.clear) {
			imgData = {
				clear: true
			};
		} else {
			imgData = this.ctx.getImageData(this.minX, this.minY,
				this.maxX - this.minX, this.maxY - this.minY);
			imgData.clear = false;
			imgData.minX = this.minX;
			imgData.minY = this.minY;
			imgData.maxX = this.maxX;
			imgData.maxY = this.maxY;
		}

		if (this.undos.length > 15) this.undos.shift();
		this.undos.push(imgData);
	}
	undo = () => {
		this.clearCanvas();

		if (this.undos.length > 0) {
			let imgData = this.undos.pop();
			this.clear = imgData.clear;
			if (imgData.clear) return;
			this.minX = imgData.minX;
			this.minY = imgData.minY;
			this.maxX = imgData.maxX;
			this.maxY = imgData.maxY;
			this.ctx.putImageData(imgData, imgData.minX, imgData.minY);
		}
	}

	bucketFill = coords => {
		const { x, y } = coords,
					{ width, height } = this.props;
		let imageData = this.ctx.getImageData(0, 0, width, height),
				arr = imageData.data;
		const targetColor = getColorAt(arr, x, y, width),
					replacementColor = getColor(this.props.stroke.color);

		if (replacementColor.r === targetColor.r &&
				replacementColor.g === targetColor.g &&
				replacementColor.b === targetColor.b) return;

		this.addUndo();

		let q = [ coords ];
		while (q.length > 0) {
			const node = q.shift();
			let west = node.x,
					east = west;
			const north = node.y;

			if (north < this.minY) this.minY = north;
			else if (north > this.maxY) this.maxY = north;

			// move west until pixel is no longer the same color as target
			do --west;
			while (west >= 0 && compareColorAtHelper(arr, west, north, width, targetColor) );
			// same in other direction
			do ++east;
			while (east < width && compareColorAtHelper(arr, east, north, width, targetColor) );

			++west;
			if (west < this.minX) this.minX = west;

			let placeAbove = true,
					placeBelow = true;
			for (;west < east; ++west) {
				setColorHelper(arr, west, north, width, replacementColor);

				if (north + 1 < height && compareColorAtHelper(arr, west, north + 1, width, targetColor)) {
					if (placeAbove) {
						q.push({ x: west, y: north + 1 });
						placeAbove = false;
					}
				} else placeAbove = true;

				if (north - 1 >= 0 && compareColorAtHelper(arr, west, north - 1, width, targetColor)) {
					if (placeBelow) {
						q.push({ x: west, y: north - 1 });
						placeBelow = false;
					}
				} else placeBelow = true;
			}

			if (west - 1 > this.maxX) this.maxX = west;
		}

		this.ctx.putImageData(imageData, 0, 0);
		this.clear = false;
	}

	// override
	render = () => (
		<div id="drawing" >
			<canvas width={this.props.width} height={this.props.height} id="canvas" ref="canvas" />
		</div>
	);
}
