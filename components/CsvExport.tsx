import React, { useEffect, useState } from 'react';
import { CSVLink, CSVDownload } from "react-csv";
import {
    Box,
    Button,
} from '@chakra-ui/react';
import { collection, query, where, getDocs, getDoc, doc, updateDoc, addDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from "../firebase/firebase";

const CsvExport = () => {
    // CSVLinkをクライアントサイドでのみレンダリングするためのuseState
    const [isClient, setIsClient] = useState(false);
    // csvエクスポート用のデータを格納するuseState
    const [ csvExportData, setCsvExportData ] = useState<any>([]);

    // CSVとしてエクスポートするデータのヘッダー
    const headers = [
        { label: "科目ID", key: "subjectId" },
        { label: "科目名", key: "subjectName" }
    ];

    // CSVとしてエクスポートするデータを作成する処理
    const getCsvExportData = async () => {
        const subjects: any = [];
        const subjectQuerySnapshot = await getDocs(collection(db, "subject"));
        subjectQuerySnapshot.docs.map((doc)=>{
            subjects.push({
                subjectId: doc.id,
                subjectName: doc.data().name
            });
        });
        setCsvExportData(subjects);
    }

    useEffect(() => {
        // CSVとしてエクスポートするためのデータを取得する処理を実行
        getCsvExportData();
        // isClientをtrueにする
        setIsClient(true);
    }, []);

    return (
        <Box>
            {
                isClient &&
                <CSVLink data={csvExportData} headers={headers} filename={"subject.csv"}>
                    <Button>
                        CSVエクスポート
                    </Button>
                </CSVLink>
            }
        </Box>
    );
}

export default CsvExport;

