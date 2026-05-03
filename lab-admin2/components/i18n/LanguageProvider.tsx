'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Language = 'en' | 'fr';

type Dictionary = {
  nav: {
    dashboard: string;
    suppliers: string;
    products: string;
    import: string;
    importLogs: string;
    quickActions: string;
    addSupplier: string;
    addProduct: string;
    adminConsole: string;
    apiStatus: string;
    connected: string;
  };
  dashboard: {
    title: string;
    totalProducts: string;
    totalProductsSub: string;
    activeSuppliers: string;
    activeSuppliersSub: (total: number) => string;
    totalImports: string;
    totalImportsSub: string;
    failedImports: string;
    failedImportsSub: string;
    suppliers: string;
    viewAll: string;
    noSuppliers: string;
    headerRow: string;
    active: string;
    inactive: string;
    addNewSupplier: string;
    recentImports: string;
    allLogs: string;
    noImports: string;
    importExcel: string;
    importExcelDesc: string;
    browseProducts: string;
    browseProductsDesc: (total: string) => string;
    manageSuppliers: string;
    manageSuppliersDesc: (total: number) => string;
  };
  ui: Record<string, string>;
};

const dictionaries: Record<Language, Dictionary> = {
  en: {
    nav: {
      dashboard: 'Dashboard',
      suppliers: 'Suppliers',
      products: 'Products',
      import: 'Import',
      importLogs: 'Import Logs',
      quickActions: 'Quick Actions',
      addSupplier: 'Add Supplier',
      addProduct: 'Add Product',
      adminConsole: 'Admin Console',
      apiStatus: 'API Status',
      connected: 'Connected',
    },
    dashboard: {
      title: 'Dashboard',
      totalProducts: 'Total Products',
      totalProductsSub: 'Across all suppliers',
      activeSuppliers: 'Active Suppliers',
      activeSuppliersSub: (total) => `${total} total`,
      totalImports: 'Total Imports',
      totalImportsSub: 'All time',
      failedImports: 'Failed Imports',
      failedImportsSub: 'Needs attention',
      suppliers: 'Suppliers',
      viewAll: 'View all',
      noSuppliers: 'No suppliers yet.',
      headerRow: 'Header row',
      active: 'Active',
      inactive: 'Inactive',
      addNewSupplier: 'Add new supplier',
      recentImports: 'Recent Imports',
      allLogs: 'All logs',
      noImports: 'No imports yet.',
      importExcel: 'Import Excel File',
      importExcelDesc: 'Upload a supplier price list',
      browseProducts: 'Browse Products',
      browseProductsDesc: (total) => `${total} products in catalogue`,
      manageSuppliers: 'Manage Suppliers',
      manageSuppliersDesc: (total) => `${total} suppliers configured`,
    },
    ui: {
      actions: 'Actions',
      active: 'Active',
      inactive: 'Inactive',
      hidden: 'Hidden',
      yes: 'Yes',
      no: 'No',
      loading: 'Loading...',
      saving: 'Saving...',
      saveChanges: 'Save Changes',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      hide: 'Hide',
      show: 'Show',
      status: 'Status',
      supplier: 'Supplier',
      suppliers: 'Suppliers',
      product: 'Product',
      products: 'Products',
      category: 'Category',
      image: 'Image',
      created: 'Created',
      contact: 'Contact',
      slug: 'Slug',
      sku: 'SKU',
      headerRow: 'Header Row',
      backToSuppliers: 'Back to suppliers',
      backToProducts: 'Back to products',
      addSupplier: 'Add Supplier',
      addProduct: 'Add Product',
      supplierSubtitle: 'Manage your data suppliers and their field mappings',
      supplierName: 'Supplier Name *',
      contactEmail: 'Contact Email',
      contactPhone: 'Contact Phone',
      notes: 'Notes',
      headerRowNumber: 'Header Row Number',
      headerRowNumberReq: 'Header Row Number *',
      headerRowHint: 'Which row in the Excel file contains the column headers? (usually 1 or 2)',
      activeCatalog: 'Active (products will appear in catalogue)',
      newSupplierSubtitle: 'Set up a new data supplier',
      saveConfigureMappings: 'Save & Configure Mappings',
      editSupplierDetails: 'Edit supplier details',
      mappings: 'Mappings',
      import: 'Import',
      importProducts: 'Import Products',
      importProductsSubtitle: 'Select a supplier to upload their Excel file',
      noSuppliersConfigured: 'No suppliers configured yet.',
      noSuppliers: 'No suppliers yet. Add your first one.',
      productsTotal: 'products total',
      searchProducts: 'Search by name, SKU, description...',
      allSuppliers: 'All suppliers',
      noProductsFound: 'No products found.',
      page: 'Page',
      of: 'of',
      prev: 'Prev',
      next: 'Next',
      productSubtitle: 'Manually create a new product entry',
      selectSupplier: 'Select supplier...',
      productFields: 'Product Fields',
      productFieldsHint: 'Add any fields from the master catalog',
      selectField: 'Select field...',
      customKey: 'Custom key',
      value: 'Value...',
      addField: 'Add field',
      createProduct: 'Create Product',
      editFields: 'Edit Fields',
      productData: 'Product Data',
      fields: 'fields',
      added: 'Added',
      updated: 'Updated',
      importLogs: 'Import Logs',
      importLogsSubtitle: 'Full history of all product imports',
      totalInserted: 'Total Inserted',
      completed: 'Completed',
      failed: 'Failed',
      file: 'File',
      inserted: 'Inserted',
      skipped: 'Skipped',
      errors: 'Errors',
      date: 'Date',
      duration: 'Duration',
      noImportLogs: 'No import logs yet.',
      fieldMappings: 'Field Mappings',
      fieldMappingsSubtitle: 'Map each product field to the correct Excel column letter',
      saveMappings: 'Save Mappings',
      field: 'Field',
      excelColumn: 'Excel Column',
      noMappings: 'No mappings yet. Add your first field below.',
      addFieldMapping: 'Add field mapping',
      mapped: 'mapped',
      saved: 'Saved!',
      savedSuccessfully: 'Saved successfully!',
      availableFields: 'Available Fields Reference',
      selectAField: 'Select a field...',
      uploadExcelSubtitle: 'Upload an Excel file to import or update products',
      mappedFields: 'Mapped fields:',
      noFieldMappings: 'No field mappings configured.',
      setupMappingsFirst: 'Set up mappings first',
      removeFile: 'Remove file',
      dropIt: 'Drop it!',
      dropExcel: 'Drop your Excel file here',
      clickBrowse: 'or click to browse - .xlsx and .xls accepted',
      importFile: 'Import file',
      importing: 'Importing...',
      importCompleted: 'Import completed!',
      rowErrors: 'row errors:',
      filePreview: 'File Preview (first 5 rows)',
      importHistory: 'Import History',
      noSupplierImports: 'No imports yet for this supplier.',
    },
  },
  fr: {
    nav: {
      dashboard: 'Tableau de bord',
      suppliers: 'Fournisseurs',
      products: 'Produits',
      import: 'Import',
      importLogs: 'Journaux',
      quickActions: 'Actions rapides',
      addSupplier: 'Ajouter fournisseur',
      addProduct: 'Ajouter produit',
      adminConsole: 'Console admin',
      apiStatus: 'Statut API',
      connected: 'Connecte',
    },
    dashboard: {
      title: 'Tableau de bord',
      totalProducts: 'Produits totaux',
      totalProductsSub: 'Tous fournisseurs confondus',
      activeSuppliers: 'Fournisseurs actifs',
      activeSuppliersSub: (total) => `${total} au total`,
      totalImports: 'Imports totaux',
      totalImportsSub: 'Depuis le debut',
      failedImports: 'Imports echoues',
      failedImportsSub: 'A verifier',
      suppliers: 'Fournisseurs',
      viewAll: 'Voir tout',
      noSuppliers: 'Aucun fournisseur pour le moment.',
      headerRow: 'Ligne d en-tete',
      active: 'Actif',
      inactive: 'Inactif',
      addNewSupplier: 'Ajouter un fournisseur',
      recentImports: 'Imports recents',
      allLogs: 'Tous les journaux',
      noImports: 'Aucun import pour le moment.',
      importExcel: 'Importer un fichier Excel',
      importExcelDesc: 'Televerser une liste de prix fournisseur',
      browseProducts: 'Parcourir les produits',
      browseProductsDesc: (total) => `${total} produits dans le catalogue`,
      manageSuppliers: 'Gerer les fournisseurs',
      manageSuppliersDesc: (total) => `${total} fournisseurs configures`,
    },
    ui: {
      actions: 'Actions',
      active: 'Actif',
      inactive: 'Inactif',
      hidden: 'Masque',
      yes: 'Oui',
      no: 'Non',
      loading: 'Chargement...',
      saving: 'Enregistrement...',
      saveChanges: 'Enregistrer',
      cancel: 'Annuler',
      edit: 'Modifier',
      delete: 'Supprimer',
      hide: 'Masquer',
      show: 'Afficher',
      status: 'Statut',
      supplier: 'Fournisseur',
      suppliers: 'Fournisseurs',
      product: 'Produit',
      products: 'Produits',
      category: 'Categorie',
      image: 'Image',
      created: 'Cree',
      contact: 'Contact',
      slug: 'Slug',
      sku: 'SKU',
      headerRow: 'Ligne d en-tete',
      backToSuppliers: 'Retour aux fournisseurs',
      backToProducts: 'Retour aux produits',
      addSupplier: 'Ajouter fournisseur',
      addProduct: 'Ajouter produit',
      supplierSubtitle: 'Gerer les fournisseurs et leurs correspondances de champs',
      supplierName: 'Nom du fournisseur *',
      contactEmail: 'Email de contact',
      contactPhone: 'Telephone de contact',
      notes: 'Notes',
      headerRowNumber: 'Numero de ligne d en-tete',
      headerRowNumberReq: 'Numero de ligne d en-tete *',
      headerRowHint: 'Quelle ligne du fichier Excel contient les en-tetes de colonnes ? (souvent 1 ou 2)',
      activeCatalog: 'Actif (les produits apparaitront dans le catalogue)',
      newSupplierSubtitle: 'Configurer un nouveau fournisseur',
      saveConfigureMappings: 'Enregistrer et configurer',
      editSupplierDetails: 'Modifier les details du fournisseur',
      mappings: 'Correspondances',
      import: 'Importer',
      importProducts: 'Importer des produits',
      importProductsSubtitle: 'Choisir un fournisseur pour importer son fichier Excel',
      noSuppliersConfigured: 'Aucun fournisseur configure.',
      noSuppliers: 'Aucun fournisseur. Ajoutez le premier.',
      productsTotal: 'produits au total',
      searchProducts: 'Rechercher par nom, SKU, description...',
      allSuppliers: 'Tous les fournisseurs',
      noProductsFound: 'Aucun produit trouve.',
      page: 'Page',
      of: 'sur',
      prev: 'Prec.',
      next: 'Suiv.',
      productSubtitle: 'Creer manuellement un nouveau produit',
      selectSupplier: 'Choisir un fournisseur...',
      productFields: 'Champs produit',
      productFieldsHint: 'Ajouter des champs du catalogue principal',
      selectField: 'Choisir un champ...',
      customKey: 'Champ personnalise',
      value: 'Valeur...',
      addField: 'Ajouter un champ',
      createProduct: 'Creer le produit',
      editFields: 'Modifier les champs',
      productData: 'Donnees produit',
      fields: 'champs',
      added: 'Ajoute',
      updated: 'Mis a jour',
      importLogs: 'Journaux d import',
      importLogsSubtitle: 'Historique complet des imports produits',
      totalInserted: 'Total insere',
      completed: 'Termine',
      failed: 'Echoue',
      file: 'Fichier',
      inserted: 'Inseres',
      skipped: 'Ignores',
      errors: 'Erreurs',
      date: 'Date',
      duration: 'Duree',
      noImportLogs: 'Aucun journal d import.',
      fieldMappings: 'Correspondances',
      fieldMappingsSubtitle: 'Associer chaque champ produit a la bonne colonne Excel',
      saveMappings: 'Enregistrer',
      field: 'Champ',
      excelColumn: 'Colonne Excel',
      noMappings: 'Aucune correspondance. Ajoutez le premier champ.',
      addFieldMapping: 'Ajouter une correspondance',
      mapped: 'associes',
      saved: 'Enregistre !',
      savedSuccessfully: 'Enregistre avec succes !',
      availableFields: 'Champs disponibles',
      selectAField: 'Choisir un champ...',
      uploadExcelSubtitle: 'Importer ou mettre a jour les produits avec un fichier Excel',
      mappedFields: 'Champs associes :',
      noFieldMappings: 'Aucune correspondance configuree.',
      setupMappingsFirst: 'Configurer les correspondances',
      removeFile: 'Retirer le fichier',
      dropIt: 'Deposez-le !',
      dropExcel: 'Deposez votre fichier Excel ici',
      clickBrowse: 'ou cliquez pour parcourir - .xlsx et .xls acceptes',
      importFile: 'Importer le fichier',
      importing: 'Import en cours...',
      importCompleted: 'Import termine !',
      rowErrors: 'erreurs de ligne :',
      filePreview: 'Apercu du fichier (5 premieres lignes)',
      importHistory: 'Historique des imports',
      noSupplierImports: 'Aucun import pour ce fournisseur.',
    },
  },
};

const LanguageContext = createContext<{
  lang: Language;
  setLang: (lang: Language) => void;
  t: Dictionary;
} | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const saved = window.localStorage.getItem('admin-language');
    if (saved === 'en' || saved === 'fr') setLangState(saved);
  }, []);

  const setLang = (next: Language) => {
    setLangState(next);
    window.localStorage.setItem('admin-language', next);
    document.documentElement.lang = next;
  };

  const value = useMemo(() => ({ lang, setLang, t: dictionaries[lang] }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
