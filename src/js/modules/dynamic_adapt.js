"use strict";


export class DynamicAdapt
{
	constructor(type) {
		this.type = type;
		this.objects = [];
		this.daClassname = "_dynamic_adapt_";
	}

	init() {
		const _this = this;

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
	
		this.arraySort();
	
		this.mediaQueries = Array.prototype.map.call(this.objects, function (item) {
			return '(' + this.type + "-width: " + item.breakpoint / 16 + "em)," + item.breakpoint; // 16 = 1em
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
			matchMedia.addEventListener('change', function () {
				_this.mediaHandler(matchMedia, objectsFilter);
			});
			this.mediaHandler(matchMedia, objectsFilter);
		}
	}

	mediaHandler(matchMedia, objects) {
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
	}

	moveTo(place, element, destination) {
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
	
	moveBack(parent, element, index) {
		element.classList.remove(this.daClassname);
		if (parent.children[index] !== undefined) {
			parent.children[index].insertAdjacentElement('beforebegin', element);
		} else {
			parent.insertAdjacentElement('beforeend', element);
		}
	}

	indexInParent(parent, element) {
		const array = Array.prototype.slice.call(parent.children);
		return Array.prototype.indexOf.call(array, element);
	}

	arraySort() {
		if (this.type === "min") {
			Array.prototype.sort.call(this.objects, function (a, b) {
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
			Array.prototype.sort.call(this.objects, function (a, b) {
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
	}
}