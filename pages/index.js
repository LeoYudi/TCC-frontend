import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MdRemoveRedEye, MdDelete, MdCheckCircleOutline } from 'react-icons/md';

import api from '../services/api';

import { parseDate, parseHours } from '../utils/date';

import { HoverLabel } from '../components/HoverLabel';
import { Loading } from '../components/Loading';
import { Modal } from '../components/Modal';

import style from '../style/Home.module.css';

async function deleteRecord(id) {
  return await api.delete(`/records/${id}`);
}

async function verifyRecord(id) {
  return await api.get(`/records/verify/${id}`);
}

export default function Home() {
  const router = useRouter();
  const [records, setRecords] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [modalContent, setModalContent] = useState(<></>);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    (async () => {
      if (records.length === 0) {
        setLoading(true);
        const data = await api.get('/records');
        setLoading(false);
        setRecords(data);
      }
    })();
  }, [records]);

  return (
    <div className={style.container}>
      <Head>
        <title>TCC</title>
      </Head>

      <div className={style.table}>
        <div className={style.row}>
          <div className={style.index}>Indice</div>
          <div className={style.description}>Descrição</div>
          <div className={style.date}>Data</div>
          <div className={style.options}>Opções</div>
        </div>
        {records.map((record, index) => (
          <div key={index} className={style.row}>
            <div className={style.index}>{index + 1}</div>
            <div className={style.description}>{record.description}</div>
            <div className={style.date}>
              {`${parseDate(record.created_at)} - ${parseHours(
                record.created_at
              )}`}
            </div>
            <div className={style.options}>
              <div
                className={style.option}
                onClick={() => {
                  router.push(`/record/${record._id}`);
                }}
              >
                <MdRemoveRedEye />
                <HoverLabel text={'Visualizar'} />
              </div>
              <div
                className={style.option}
                onClick={async () => {
                  setLoading(true);
                  const response = await verifyRecord(record._id);
                  setLoading(false);

                  if (response.error) {
                    setModalContent(response.error);
                    setShowModal(true);
                    return;
                  }

                  setModalContent(
                    <div className={style.modalContent}>
                      {Object.keys(response.sensors).map(sensor => (
                        <>
                          <div className={style.sensorName}>{sensor}</div>
                          <div>Maior intervalo: {response.sensors[sensor].biggestGap} ms </div>
                          <div>Menor intervalo: {response.sensors[sensor].lowestGap} ms </div>
                        </>
                      ))}
                    </div>
                  );

                  setShowModal(true);
                }}
              >
                <MdCheckCircleOutline />
                <HoverLabel text={'Checar intervalos'} />
              </div>
              <div
                className={style.option}
                onClick={async () => {
                  if (window.confirm('Tem certeza que quer deletar esta gravação ?')) {
                    setLoading(true);
                    const response = await deleteRecord(record._id);
                    setLoading(false);

                    if (response.error) {
                      setModalContent(response.error);
                      setShowModal(true);
                      return;
                    }

                    records.splice(index, 1);
                    setRecords([...records]);
                  }
                }}
              >
                <MdDelete />
                <HoverLabel text={'Deletar'} />
              </div>

            </div>
          </div>
        ))
        }
      </div>
      <Loading isLoading={isLoading} />
      <Modal show={showModal} onClose={() => { setShowModal(false) }}>
        {modalContent}
      </Modal>
    </div>
  );
}
