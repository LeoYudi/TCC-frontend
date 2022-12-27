import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MdKeyboardArrowLeft, MdHelpOutline } from 'react-icons/md';

import { Card } from '../../components/Card';
import { Graph } from '../../components/Graph';
import { HoverLabel } from '../../components/HoverLabel';
import { Input } from '../../components/Input';
import { Loading } from '../../components/Loading';
import { Map } from '../../components/Map';

import { sensorsConfig } from '../../config/sensors';

import api from '../../services/api';

import { parseDate, parseHours } from '../../utils/date';

import style from './style.module.css';

export default function Record() {
  const defaultInterval = 1000;

  const router = useRouter();
  const [record, setRecord] = useState({});
  const [averageInterval, setAverageInterval] = useState(defaultInterval);
  const [firstTimestamp, setFirstTimestamp] = useState(0);

  useEffect(() => {
    if (Object.keys(record).length === 0) {
      (async () => {
        const response = await api.get(`/records/${router.query.id}`);

        if (response.error) {
          console.log(response.error);
          return;
        }

        const min = Math.min(
          response.sensors.acelerometro[0].timestamp,
          response.sensors.giroscopio[0].timestamp,
          response.sensors.magnetometro[0].timestamp
        )
        setFirstTimestamp(min);

        setRecord({ ...response });
      })();
    }
  }, [record, router.query.id]);

  const parseRecord = (record, key) => {
    const parse = [];
    let sum = 0;
    let initialTime = firstTimestamp;
    let count = 0;

    for (const r of record) {
      if (r.timestamp >= initialTime && r.timestamp < initialTime + averageInterval) {
        sum += r[key];
        count++;
      } else {
        if (count !== 0) {
          parse.push({
            x: (initialTime + (averageInterval / 2) - firstTimestamp) / 1000,
            y: Math.round((sum / count) * 1000) / 1000
          });
        }
        sum = r[key];
        count = 1;

        if (r.timestamp < initialTime + (2 * averageInterval))
          initialTime += averageInterval;
        else
          initialTime += Math.floor((r.timestamp - initialTime) / averageInterval) * averageInterval;

      }
    }

    parse.push({
      x: (initialTime + (averageInterval / 2) - firstTimestamp) / 1000,
      y: Math.round((sum / count) * 1000) / 1000
    });

    return parse;
  }

  const getDuration = sensor => {
    const durationMs = sensor[sensor.length - 1].timestamp - sensor[0].timestamp;
    const seconds = parseInt(durationMs / 1000);

    return `${parseInt(seconds / 60)}m ${seconds % 60}s`;
  }

  if (Object.keys(record).length === 0)
    return <Loading isLoading={true} />;

  return (
    <>
      <Head>
        <title>Gravação</title>
      </Head>

      <div className={style.header}>
        <div
          className={style.backButton}
          onClick={() => { router.push('/') }}
        >
          <MdKeyboardArrowLeft />
        </div>
        <div className={style.title}>{record.description}</div>
        <div className={style.averageContainer}>
          <div className={style.helpIcon}>
            <MdHelpOutline />
            <HoverLabel text={`Intervalo padrão: ${averageInterval}ms`} />
          </div>
          <Input
            placeholder={'Intervalo para média'}
            onChange={value => {
              if (value) {
                if (parseInt(value) !== averageInterval)
                  setAverageInterval(parseInt(value))
              }
              else {
                if (averageInterval !== defaultInterval)
                  setAverageInterval(defaultInterval)
              }
            }}
          />
        </div>
      </div>

      <div className={style.container}>
        <div className={style.mainContainer}>
          <Card label={'Data'}>
            {`${parseDate(record.created_at)} - ${parseHours(record.created_at)}`}
          </Card>
          <Card label={'Duração'}>
            {`${getDuration(record.sensors.acelerometro)}`}
          </Card>

          {
            Object.keys(record.sensors).map((sensorName, index) => (
              <Card key={index} label={sensorName}>
                {`${record.sensors[sensorName].length} registros`}
              </Card>
            ))
          }

          <Card label={'GPS'}>
            {`${record.locations.length} registros`}
          </Card>
        </div>

        <div className={style.graphsContainer}>
          <div className={style.sensorGraph}>
            {
              Object.keys(record.sensors).map(sensorName => (
                <Card key={sensorName} label={sensorName}>
                  <div className={style.graphsContainer}>
                    {
                      Object.keys(record.sensors[sensorName][0]).map(key => {
                        if (['x', 'y', 'z'].includes(key))
                          return (
                            <Card key={key} label={`Eixo ${key.toUpperCase()}`}>
                              <Graph data={parseRecord(record.sensors[sensorName], key)} xAxisLabel={'Timestamp (em segundos)'} yAxisLabel={sensorsConfig[sensorName].yAxisLabel} />
                            </Card>
                          )
                      })
                    }
                  </div>
                </Card>
              ))
            }

            {
              record.locations[0] &&
              <Card label={'GPS'}>
                <div className={style.graphsContainer}>
                  <Card label={'Altitude'}>
                    <Graph data={parseRecord(record.locations, 'alt')} xAxisLabel={'Timestamp (em segundos)'} yAxisLabel={sensorsConfig.locations.yAxisLabel} />
                  </Card>
                  <Card label={'Mapa'}>
                    <Map locations={record.locations} />
                  </Card>
                </div>
              </Card>
            }
          </div>
        </div>
      </div >
    </>
  );
}