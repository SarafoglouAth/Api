import React from "react";
import { Document, Page, Text, View, Image, PDFDownloadLink, StyleSheet } from '@react-pdf/renderer';
import { Button } from "primereact/button";
const CertificateBase = "https://i.ibb.co/5RHBxZ6/Certificate-Base.png";
// Define styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        padding: 0,
    },
    section: {
        position: 'relative',
        width: '100%',
        height: '100%',
    },
    name: {
        fontSize:25,
        position: 'absolute',
        top: '52%',
        left: '25%',
    },
    id: {
        position: 'absolute',
        top: '95%',
        right: '80%',
        fontSize:15,
    },
    course: {
        fontSize:25,
        top: '65%',
        position: 'absolute',
        left: '35%',
    },
    date: {
        fontSize:15,
        position: 'absolute',
        top: '1%',
        left: '81%',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

// Document component
const MyDocument = ({ name, date, course, id }) => (
    <Document>
        <Page size="A5" style={styles.page}>
            <View style={styles.section}>
                <Image src={CertificateBase} style={styles.image} />

                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.date}>{date}</Text>
                    <Text style={styles.course}>{course}</Text>
                    <Text style={styles.id}>#{id}</Text>

            </View>
        </Page>
    </Document>
);

// React component
export default function Tester({ name, date, course, id }) {


    return (
        <div className="App">
            <div className="Meta">
                <PDFDownloadLink
                    document={
                        <MyDocument
                            name={name}
                            date={date}
                            course={course}
                            id={id}
                        />
                    }
                    fileName="certificate.pdf"
                >
                    {({ blob, url, loading, error }) =>
                        loading ? 'Loading document...' : 'Download PDF'
                    }
                </PDFDownloadLink>
            </div>
        </div>
    );
}
