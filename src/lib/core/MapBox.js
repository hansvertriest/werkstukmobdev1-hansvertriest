/**
 * A MapBox wrapper
 * docs: https://docs.mapbox.com/mapbox-gl-js/api/
 *
 * @author Tim De Paepe <tim.depaepe@arteveldehs.be>
 */

import mapboxgl from 'mapbox-gl/dist/mapbox-gl';

class MapBox {
	constructor(apiKey, options = {}) {
		// set the apiKey & accessToken
		this.apiKey = apiKey;
		mapboxgl.accessToken = this.apiKey;

		// set the options (in case nothing was added, get the defaultOptions)
		this.options = Object.keys(options).length === 0 ? this.getDefaultOptions() : options;

		// create a new mapbox instance
		this.map = new mapboxgl.Map(this.options);
	}

	getDefaultOptions() {
		return {
			container: 'map',
			style: 'mapbox://styles/mapbox/streets-v11',
			zoom: 13,
		};
	}

	getMap() {
		return this.map;
	}

	goToCoords(long, lat) {
		this.map.jumpTo({ center: [long, lat] });
		this.map.zoomTo(16);
	}

	getMemberLayers(members) {
		const allLayers = this.getMap().getStyle().layers;
		return allLayers.filter((layer) => members.includes(layer.id))
			.map((layer) => layer.id);
	}

	addPoint(source, coordinates) {
		this.getMap().addSource(source, {
			type: 'geojson',
			data: {
				type: 'Point',
				coordinates,
			},
		});
		this.getMap().addLayer({
			id: source,
			source,
			type: 'circle',
			paint: {
				'circle-radius': 10,
				'circle-color': '#007cbf',
			},
		});
	}

	removePoint(source) {
		this.getMap().removeLayer(source);
		this.getMap().removeSource(source);
	}

	updatePointcolor(source, color) {
		this.getMap().setPaintProperty(source, 'circle-color', color);
	}

	smoothDotMove(source, data, time) {
		const frameTime = 400;
		const framesAmount = Math.floor(time / frameTime);
		let currentFrame = 0;
		const lonOld = this.getMap().getSource(source)._data.coordinates[0];
		const latOld = this.getMap().getSource(source)._data.coordinates[1];
		const lonDifference = lonOld - data.coordinates[0];
		const latDifference = latOld - data.coordinates[1];
		const lonPerFrame = lonDifference / framesAmount;
		const latPerFrame = latDifference / framesAmount;
		const interval = setInterval(() => {
			console.log(lonPerFrame);
			const lonPrevious = this.getMap().getSource(source)._data.coordinates[0];
			const latPrevious = this.getMap().getSource(source)._data.coordinates[1];
			// calculate new distance
			// create a geoJson object
			const newData = {
				type: 'Point',
				coordinates: [lonPrevious + lonPerFrame, latPrevious + latPerFrame],
			};
			// update location
			this.getMap().getSource(source).setData(newData);
			// check if all frames have been updated
			if (currentFrame === framesAmount) {
				clearInterval(interval);
				console.log('step done');
			}
			// add to curretnframe
			currentFrame++;
		}, frameTime);
	}

	changeData(source, data) {
		this.getMap().getSource(source).setData(data);
		// this.smoothDotMove(source, data, 3000);
	}
}

export default MapBox;
