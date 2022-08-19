import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MdRemoveRedEye, MdDelete } from 'react-icons/md';

import api from '../services/api';

import { parseDate, parseHours } from '../utils/date';

import { Loading } from '../components/Loading';

import styles from '../styles/Home.module.css';

async function deleteRecord(id) {
  return await api.delete(`/records/${id}`);
}

export default function Home() {
  const router = useRouter();
  const [records, setRecords] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (records.length === 0) {
        setLoading(true);
        const data = await api.get('/records');
        console.log(data);
        setLoading(false);
        setRecords(data);
      }
    })();
  }, [records]);

  return (
    <div className={styles.container}>
      <Head>
        <title>TCC</title>
      </Head>

      <div className={styles.table}>
        <div className={styles.row}>
          <div className={styles.index}>Indice</div>
          <div className={styles.description}>Descrição</div>
          <div className={styles.date}>Data</div>
          <div className={styles.options}>Opções</div>
        </div>
        {records.map((record, index) => (
          <div key={index} className={styles.row}>
            <div className={styles.index}>{index + 1}</div>
            <div className={styles.description}>{record.description}</div>
            <div className={styles.date}>
              {`${parseDate(record.created_at)} - ${parseHours(
                record.created_at
              )}`}
            </div>
            <div className={styles.options}>
              <div
                className={styles.option}
                onClick={() => {
                  router.push(`/record/${record._id}`);
                }}
              >
                <MdRemoveRedEye />
              </div>
              <div
                className={styles.option}
                onClick={async () => {
                  if (window.confirm('Tem certeza que quer deletar esta gravação ?')) {
                    const response = await deleteRecord(record._id);

                    if (response.error) {
                      window.alert(response.error);
                      return;
                    }

                    records.splice(index, 1);
                    setRecords([...records]);
                  }
                }}
              >
                <MdDelete />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Loading isLoading={isLoading} />
    </div>
  );
}
