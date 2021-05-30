import React, {useCallback, useEffect, useRef, useState} from 'react';
import {api} from '../services/api';
import styles from '../styles/Home.module.scss';
import GetCanvasImage from '../utils/GetCanvasImage';

interface CanvasProps {
    width: number;
    height: number;
}

type Coordinate = {
    x: number;
    y: number;
};

const Canvas = ({width, height}: CanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPainting, setIsPainting] = useState(false);
    const [mousePosition, setMousePosition] =
        useState<Coordinate | undefined>(undefined);

    const startPaint = useCallback((event: MouseEvent) => {
        const coordinates = getCoordinates(event);

        if (coordinates) {
            setMousePosition(coordinates);
            setIsPainting(true);
        }
    }, []);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }

        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.addEventListener('mousedown', startPaint);

        return () => {
            canvas.removeEventListener('mousedown', startPaint);
        };
    }, [startPaint]);

    const paint = useCallback(
        (event: MouseEvent) => {
            if (isPainting) {
                const newMousePosition = getCoordinates(event);

                if (mousePosition && newMousePosition) {
                    drawLine(mousePosition, newMousePosition);
                    setMousePosition(newMousePosition);
                }
            }
        },
        [isPainting, mousePosition],
    );

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }

        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.addEventListener('mousemove', paint);

        return () => {
            canvas.removeEventListener('mousemove', paint);
        };
    }, [paint]);

    const exitPaint = useCallback(() => {
        setIsPainting(false);
        setMousePosition(undefined);

        const canvas: HTMLCanvasElement = document.getElementById(
            'myCanvas',
        ) as HTMLCanvasElement;

        canvas.toBlob(async (blob) => {
            await predictImage(blob);
        });
    }, []);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.addEventListener('mouseup', exitPaint);
        canvas.addEventListener('mouseleave', exitPaint);
        return () => {
            canvas.removeEventListener('mouseup', exitPaint);
            canvas.removeEventListener('mouseleave', exitPaint);
        };
    }, [exitPaint]);

    const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
        if (!canvasRef.current) {
            return;
        }

        const canvas: HTMLCanvasElement = canvasRef.current;
        return {
            x: event.pageX - canvas.offsetLeft,
            y: event.pageY - canvas.offsetTop,
        };
    };

    const drawLine = (
        originalMousePosition: Coordinate,
        newMousePosition: Coordinate,
    ) => {
        if (!canvasRef.current) {
            return;
        }

        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) {
            return;
        }

        context.strokeStyle = 'black';
        context.lineJoin = 'round';
        context.lineWidth = 20;

        context.beginPath();
        context.moveTo(originalMousePosition.x, originalMousePosition.y);
        context.lineTo(newMousePosition.x, newMousePosition.y);
        context.closePath();

        context.stroke();
    };

    return (
        <canvas
            id="myCanvas"
            ref={canvasRef}
            height={height}
            width={width}
            className={styles.card}
        />
    );
};

Canvas.defaultProps = {
    width: 500,
    height: 500,
};

async function predictImage(blob: Blob): Promise<void> {
    const response = await api.post(
        'predict',
        {file: blob},
        {headers: {'Content-Type': 'multipart/form-data'}},
    );

    console.log(response.data);

    return response.data;
}

export default Canvas;
