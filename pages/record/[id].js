import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MdKeyboardArrowLeft } from 'react-icons/md';

import { Card } from '../../components/Card';
import { Graph } from '../../components/Graph';
import { Input } from '../../components/Input';
import { Loading } from '../../components/Loading';

import { sensorsConfig } from '../../config/sensors';

import api from '../../services/api';

import { parseDate, parseHours } from '../../utils/date';

import style from './style.module.css';

export default function Record() {
  const defaultInterval = 500;

  const router = useRouter();
  const [record, setRecord] = useState({});
  const [averageInterval, setAverageInterval] = useState(defaultInterval);

  useEffect(() => {
    if (Object.keys(record).length === 0) {
      (async () => {
        const response = await api.get(`/records/${router.query.id}`);

        if (response.error) {
          console.log(response.error);
          return;
        }

        setRecord({ ...response });
      })();
    }
  }, [record, router.query.id]);

  const parseRecord = (record, key) => {
    const parse = [];
    let sum = 0;
    let initialTime = record[0].timestamp;
    let count = 0;

    for (const r of record) {
      if (r.timestamp >= initialTime && r.timestamp < initialTime + averageInterval) {
        sum += r[key];
        count++;
      } else {
        parse.push({
          x: (initialTime + (averageInterval / 2) - record[0].timestamp) / 1000,
          y: Math.round((sum / count) * 1000) / 1000
        });
        initialTime += averageInterval;
        sum = r[key];
        count = 1;
      }
    }

    parse.push({
      x: (initialTime + (averageInterval / 2) - record[0].timestamp) / 1000,
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
          </div>
        </div>
      </div >
    </>
  );
}