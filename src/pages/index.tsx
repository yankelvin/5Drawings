import Head from 'next/head';
import Canvas from '../components/canvas';
import styles from '../styles/Home.module.scss';

import {api} from '../services/api';
import {useState} from 'react';

export default function Home() {
    const [object, setObject] = useState(null);

    const clearCanvas = () => {
        const canvas: HTMLCanvasElement = document.getElementById(
            'myCanvas',
        ) as HTMLCanvasElement;
        canvas.width += 0;
    };

    async function predictImage(blob: Blob): Promise<void> {
        const data = new FormData();
        data.append('file', blob, 'file');

        const response = await api.post('predict', data, {
            headers: {'content-type': 'multipart/form-data'},
        });

        const {predict} = response.data;

        let maxValue = 0;
        let maxIndex = 0;

        predict.forEach((value: number, index: number) => {
            if (value > maxValue) {
                maxValue = value;
                maxIndex = index;
            }
        });

        switch (maxIndex) {
            case 0:
                setObject('Olho');
                break;
            case 1:
                setObject('Peixe');
                break;
            case 2:
                setObject('Diamante');
                break;
            case 3:
                setObject('Borboleta');
                break;
            case 4:
                setObject('Melância');
                break;
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>5Drawings</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Bem vindo ao{' '}
                    <a href="https://github.com/yankelvin/5Drawings">
                        5Drawings!
                    </a>
                </h1>

                <p className={styles.description}>
                    Desenhos treinados: olho, peixe, diamante, borboleta e
                    melância.
                </p>

                {object && (
                    <span className={styles.description}>
                        <i>O seu desenho é um(a): {object}</i>
                    </span>
                )}

                <Canvas width={500} height={500} predictImage={predictImage} />

                <button className={styles.button} onClick={clearCanvas}>
                    Limpar
                </button>
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://github.com/yankelvin"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Github
                </a>
            </footer>
        </div>
    );
}
