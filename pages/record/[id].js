import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Card } from '../../components/Card';
import { Graph } from '../../components/Graph';
import { Loading } from '../../components/Loading';

import api from '../../services/api';

import { parseDate, parseHours } from '../../utils/date';

import style from './style.module.css';

export default function Record() {
  const router = useRouter();
  const [record, setRecord] = useState({});

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

  const parseRecord = record =>
    record.map(r => ({ x: r.timestamp - record[0].timestamp, y: r.x }));

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

      <div className={style.container}>
        <div className={style.mainContainer}>
          <Card label={'Descrição'}>
            {record.description}
          </Card>
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
            <Card label={'acelerometro'}>
              <Graph data={parseRecord(record.sensors.acelerometro)} xAxisLabel={'Timestamp (em ms)'} yAxisLabel={'Aceleração (em gravidades)'} />
            </Card>
          </div>
        </div>
      </div >
    </>
  );
}