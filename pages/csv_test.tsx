import {
    Box,
} from '@chakra-ui/react';
import CsvImport from '@/components/CsvImport';
import CsvExport from '@/components/CsvExport';


const Csv_test = () => {
    return (
        <Box>
            <Box p={3}>
                <Box mb={2}>
                    <p>CSVインポート</p>
                </Box>
                <CsvImport/>
            </Box>
            <Box p={3}>
                <Box mb={2}>
                    <p>CSVエクスポート</p>
                </Box>
                <CsvExport/>
            </Box>
        </Box>
    );
}

export default Csv_test;
