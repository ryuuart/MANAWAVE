/**
 * Download a file to the user browser download folder.
 * @param name the filename
 * @param blob the binary that represents the file contents
 */
export function download(name: string = "untitled", blob: Blob) {
    const downloadURL = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = downloadURL;
    link.download = name;
    link.click();

    URL.revokeObjectURL(downloadURL);
}

/**
 * Converts a json object into a file binary.
 * @param json the json that'll be encoded into a binary format
 * @returns the json formatted into a binary data representation
 */
export function jsonToBinary(json: object): Blob {
    return new Blob([JSON.stringify(json)], { type: "application/json" });
}
