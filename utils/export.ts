// This utility handles exporting data to CSV format.
// NOTE: PDF export was removed to simplify dependencies and focus on the core CSV feature.

/**
 * Converts an array of objects to a CSV string and triggers a download.
 * @param data - The array of objects to export.
 * @param fileName - The name of the file to be downloaded (without extension).
 */
export const exportToCSV = (data: Record<string, any>[], fileName: string) => {
    if (data.length === 0) {
        alert("No data to export.");
        return;
    }
    const headers = Object.keys(data[0]);
    
    // Sanitize data for CSV: escape commas and quotes
    const sanitizeCell = (cellData: any): string => {
        if (cellData === null || cellData === undefined) {
            return '';
        }
        const str = String(cellData);
        // If the string contains a comma, double quote, or newline, wrap it in double quotes.
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            // Within a quoted field, a double quote must be escaped by another double quote.
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };
    
    const csvRows = [
        headers.join(','),
        ...data.map(row => 
            headers.map(header => sanitizeCell(row[header])).join(',')
        )
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${fileName}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};