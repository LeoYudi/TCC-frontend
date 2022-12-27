import { useEffect, useState } from 'react';

import Circle from 'ol/geom/Circle';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Fill from 'ol/style/Fill';
import MultiLineString from 'ol/geom/MultiLineString';
import OlMap from 'ol/Map';
import OSM from 'ol/source/OSM';
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
    const circleStyle = new Style({
      fill: new Fill({
        color: '#f9aa33'
      }),
      stroke: new Stroke({
        color: '#f9aa33',
        width: 0.5
      })
    });

    const startCircleStyle = new Style({
      fill: new Fill({
        color: '#fff'
      }),
      stroke: new Stroke({
        color: 'red',
        width: 3
      })
    });

    const finishCircleStyle = new Style({
      fill: new Fill({
        color: '#fff'
      }),
      stroke: new Stroke({
        color: '#007bff',
        width: 3
      })
    });

    const vectorSourcePoint = new VectorSource({});
    const vectorSourceLines = new VectorSource({});

    const coords = [];

    for (const index in locations) {
      const location = locations[index];
      const coord = fromLonLat([location.lon, location.lat]);
      coords.push(coord);
      const point = new Circle(coord, index == 0 || index == locations.length - 1 ? 6 : 4);
      const feature = new Feature({ geometry: point });

      if (index == 0)
        feature.setStyle(startCircleStyle);
      else if (index == locations.length - 1)
        feature.setStyle(finishCircleStyle);
      else
        feature.setStyle(circleStyle);

      vectorSourcePoint.addFeature(feature);
    }

    const path = new MultiLineString([coords]);
    const newFeature = new Feature({
      name: 'Path',
      geometry: path,
      style: new Style({}),
    });

    vectorSourceLines.addFeature(newFeature);

    return { vectorSourceLines, vectorSourcePoint };
  };

  useEffect(() => {
    if (!olmap) {
      const { vectorSourceLines, vectorSourcePoint } = getPointsAndLines(locations);
      //console.log(vectorSourcePoint.getFeatures());

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
    <div id='map' className={styles.map}>
      <div className={styles.legend}>
        <div className={styles.legendRow}>
          <div className={styles.square} style={{ backgroundColor: 'red' }} />
          <div className={styles.text}>
            Início
          </div>
        </div>
        <div className={styles.legendRow}>
          <div className={styles.square} style={{ backgroundColor: '#007bff' }} />
          <div className={styles.text}>
            Fim
          </div>
        </div>
      </div>
    </div>
  );
}

export { Map };