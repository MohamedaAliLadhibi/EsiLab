'use client';

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#111' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderBottomWidth: 2, borderBottomColor: '#1e40af', paddingBottom: 10, marginBottom: 20,
  },
  brand: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  brandAccent: { color: '#1e40af' },
  docTitle: { fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: 1.5 },
  productRow: { flexDirection: 'row', marginBottom: 20 },
  imageBox: {
    width: 180, height: 180, marginRight: 20,
    borderWidth: 1, borderColor: '#eee',
    justifyContent: 'center', alignItems: 'center',
  },
  productImage: { width: 160, height: 160, objectFit: 'contain' },
  productInfo: { flex: 1 },
  productName: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  productSku: { fontSize: 10, color: '#666', marginBottom: 12, fontFamily: 'Courier' },
  table: { marginTop: 8, borderTopWidth: 1, borderColor: '#ddd' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ddd', paddingVertical: 5 },
  tableKey: { width: 130, fontWeight: 'bold', color: '#444' },
  tableValue: { flex: 1 },
  sectionTitle: {
    fontSize: 11, fontWeight: 'bold', marginTop: 18, marginBottom: 6,
    color: '#1e40af', textTransform: 'uppercase', letterSpacing: 1,
  },
  description: { lineHeight: 1.5, color: '#333', textAlign: 'justify' },
  footer: {
    position: 'absolute', bottom: 30, left: 40, right: 40,
    borderTopWidth: 1, borderColor: '#eee', paddingTop: 8,
    fontSize: 8, color: '#999',
    flexDirection: 'row', justifyContent: 'space-between',
  },
});

export type DataSheetProduct = {
  name: string;
  sku?: string;
  brand?: string;
  category?: string;
  packageSize?: string;
  shortDescription?: string;
  description?: string;
  /** Raw remote image URL. The button converts it to a base64 data URL before rendering. */
  imageUrl?: string;
  /** Optional pre-resolved data URL (used internally by the button after fetching). */
  imageDataUrl?: string;
  specs: Array<{ label: string; value: string }>;
};

type Props = {
  product: DataSheetProduct;
  generatedAt?: Date;
};

export function TechnicalDataSheet({ product, generatedAt }: Props) {
  const date = (generatedAt ?? new Date()).toLocaleDateString('fr-FR');
  const imageSrc = product.imageDataUrl || product.imageUrl;
  const baseRows: Array<{ key: string; value: string }> = [];
  if (product.sku) baseRows.push({ key: 'Référence', value: product.sku });
  if (product.brand) baseRows.push({ key: 'Marque', value: product.brand });
  if (product.category) baseRows.push({ key: 'Univers', value: product.category });
  if (product.packageSize) baseRows.push({ key: 'Conditionnement', value: product.packageSize });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>
            ESI<Text style={styles.brandAccent}>LAB</Text>
          </Text>
          <Text style={styles.docTitle}>Fiche Technique</Text>
        </View>

        <View style={styles.productRow}>
          {imageSrc ? (
            <View style={styles.imageBox}>
              <Image style={styles.productImage} src={imageSrc} />
            </View>
          ) : null}
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            {product.sku ? <Text style={styles.productSku}>Réf. {product.sku}</Text> : null}

            <View style={styles.table}>
              {baseRows.map((r) => (
                <View key={r.key} style={styles.tableRow}>
                  <Text style={styles.tableKey}>{r.key}</Text>
                  <Text style={styles.tableValue}>{r.value}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {product.shortDescription && product.shortDescription !== product.name && (
          <>
            <Text style={styles.sectionTitle}>Résumé</Text>
            <Text style={styles.description}>{product.shortDescription}</Text>
          </>
        )}

        {product.description && product.description !== product.shortDescription && (
          <>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </>
        )}

        {product.specs.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Caractéristiques</Text>
            <View style={styles.table}>
              {product.specs.map((spec) => (
                <View key={spec.label} style={styles.tableRow}>
                  <Text style={styles.tableKey}>{spec.label}</Text>
                  <Text style={styles.tableValue}>{spec.value}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={styles.footer} fixed>
          <Text>EsiLab — Généré le {date}</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}