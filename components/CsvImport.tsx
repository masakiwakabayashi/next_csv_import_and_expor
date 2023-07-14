import { useCallback } from 'react';
import React, { useState } from "react";
import { useDropzone } from 'react-dropzone';
import { readString } from 'react-papaparse';
import {
    Box,
    Button,
} from '@chakra-ui/react';
import { collection, query, where, getDocs, getDoc, doc, updateDoc, addDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from "../firebase/firebase";

// CSVのデータをFirestoreに保存する関数
const HandleFileRead = (binaryStr: any) => {
    readString(binaryStr, {
        worker: true,
        complete: async (results: any) => {
            // エラーメッセージの初期化
            (document.getElementById('csv_import_error_message') as HTMLElement).innerHTML = '';
            // バリデーションの処理
            for (let i=0; i<results.data.length; i++) {
                // 科目IDもしくは科目名が入力されていないときのバリデーション
                if (!results.data[i][0] || !results.data[i][1]) {
                    (document.getElementById('csv_import_error_message') as HTMLElement).innerHTML = '科目IDもしくは科目名が入力されていないセルがあります。';
                    return false;
                }
            }
            // FirestoreにCSVデータを保存する処理 (results.dataは配列になったCSVデータ)
            for (let i = 1; i < results.data.length; i++) {
                // CSVデータの1列目をドキュメントIDとして指定
                const docRef = doc(db, "subject", results.data[i][0]);
                // CSVデータの2列目をドキュメントのnameフィールドに指定してFirestoreに保存
                await setDoc(docRef, {
                    name: results.data[i][1],
                });
            }
        }
    });
}


const CsvImport = () => {
    // CSVをドロップしたときに呼び出される処理
    const onDrop = useCallback((acceptedFiles: any) => {
        acceptedFiles.forEach((file: any) => {
            const reader = new FileReader();
            reader.onabort = () => console.log('file reading was aborted');
            reader.onerror = () => console.log('file reading has failed');
            reader.onload = () => {
                const binaryStr = reader.result;
                // CSVのデータをFirestoreに保存する処理
                HandleFileRead(binaryStr);
            }
            reader.readAsText(file);
        });
    }, []);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    return (
        <div className="App">
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                { isDragActive ? <p>Drop the files here ...</p>
                    : <Button>ファイルを選択</Button>
                }
            </div>
            {/* CSVバリデーションのエラーメッセージ */}
            <Box id="csv_import_error_message" color={'red'}></Box>
        </div>
    );
}

export default CsvImport;
