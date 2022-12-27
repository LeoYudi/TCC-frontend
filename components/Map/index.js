import { useEffect, useState } from 'react';

import Circle from 'ol/geom/Circle';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Fill from 'ol/style/Fill';
import MultiLineString from 'ol/geom/MultiLineString';
import OlMap from 'ol/Map';
import OSM from 'ol/source/OSM';
import Point from 'ol/geom/Point';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Tile from 'ol/layer/Tile';
import Vector from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';

import styles from './style.module.css';

function Map({ locations }) {
  const [center, setCenter] = useState(fromLonLat([locations[0].lon, locations[0].lat]));
  const [zoom, setZoom] = useState(17);

  const [olmap, setOlMap] = useState(null);

  const getPointsAndLines = (locations) => {
    const style = new Style({
      fill: new Fill({
        color: '#f9aa33'
      }),
      stroke: new Stroke({
        color: '#f9aa33',
        width: 0.5
      })
    });

    const vectorSourcePoint = new VectorSource({});
    const vectorSourceLines = new VectorSource({});

    const coords = [];

    for (const location of locations) {
      const coord = fromLonLat([location.lon, location.lat]);
      coords.push(coord);
      const point = new Circle(coord, 4);
      const feature = new Feature({ geometry: point });
      feature.setStyle(style);
      vectorSourcePoint.addFeature(feature);
    }

    const path = new MultiLineString([coords]);
    const newFeature = new Feature({
      name: 'Path',
      geometry: path,
      style: new Style({}),
    });

    vectorSourceLines.addFeature(newFeature);

    return { style, vectorSourceLines, vectorSourcePoint };
  };

  useEffect(() => {
    if (!olmap) {
      const { style, vectorSourceLines, vectorSourcePoint } = getPointsAndLines(locations);

      const firstMap = new OlMap({
        target: 'map',
        layers: [
          new Tile({
            source: new OSM()
          }),
          new Vector({
            source: vectorSourceLines
          }),
          new Vector({
            source: vectorSourcePoint,
            //style: style
          })
        ],
        view: new View({
          center: center,
          zoom: zoom
        })
      });

      firstMap.on('moveend', () => {
        let newCenter = firstMap.getView().getCenter();
        let newZoom = firstMap.getView().getZoom();
        setCenter(newCenter);
        setZoom(newZoom);
      })

      setOlMap(firstMap);
    }

  }, [center, locations, olmap, zoom]);

  return (
    <div id='map' className={styles.map} />
  );
}

export { Map };