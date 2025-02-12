"use strict";


function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;

	this.objects = [];
	this.daClassname = "_dynamic_adapt_";

	this.nodes = document.querySelectorAll("[data-da]");


	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const object = {};
		object.element = node;
		object.parent = node.parentNode;
		object.destination = document.querySelector(dataArray[0].trim());
		object.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		object.place = dataArray[2] ? dataArray[2].trim() : "last";
		object.index = this.indexInParent(object.parent, object.element);
		this.objects.push(object);
	}

	this.arraySort(this.objects);

	this.mediaQueries = Array.prototype.map.call(this.objects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint / 16 + "rem)," + item.breakpoint; // | / 16 |  rem
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];


		const objectsFilter = Array.prototype.filter.call(this.objects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, objectsFilter);
		});
		this.mediaHandler(matchMedia, objectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, objects) {
	if (matchMedia.matches) {
		for (let i = 0; i < objects.length; i++) {
			const object = objects[i];
			object.index = this.indexInParent(object.parent, object.element);
			this.moveTo(object.place, object.element, object.destination);
		}
	} else {
		for (let i = 0; i < objects.length; i++) {
			const object = objects[i];
			if (object.element.classList.contains(this.daClassname)) {
				this.moveBack(object.parent, object.element, object.index);
			}
		}
	}
};

DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		console.log(parent.children[index])
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();