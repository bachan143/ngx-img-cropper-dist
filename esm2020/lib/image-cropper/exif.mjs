export class Fraction extends Number {
}
export class Exif {
    constructor() {
        this.debug = false;
        this.IptcFieldMap = {
            0x78: 'caption',
            0x6e: 'credit',
            0x19: 'keywords',
            0x37: 'dateCreated',
            0x50: 'byline',
            0x55: 'bylineTitle',
            0x7a: 'captionWriter',
            0x69: 'headline',
            0x74: 'copyright',
            0x0f: 'category'
        };
        this.Tags = {
            // version tags
            0x9000: 'ExifVersion',
            0xa000: 'FlashpixVersion',
            // colorspace tags
            0xa001: 'ColorSpace',
            // image configuration
            0xa002: 'PixelXDimension',
            0xa003: 'PixelYDimension',
            0x9101: 'ComponentsConfiguration',
            0x9102: 'CompressedBitsPerPixel',
            // user information
            0x927c: 'MakerNote',
            0x9286: 'UserComment',
            // related file
            0xa004: 'RelatedSoundFile',
            // date and time
            0x9003: 'DateTimeOriginal',
            0x9004: 'DateTimeDigitized',
            0x9290: 'SubsecTime',
            0x9291: 'SubsecTimeOriginal',
            0x9292: 'SubsecTimeDigitized',
            // picture-taking conditions
            0x829a: 'ExposureTime',
            0x829d: 'FNumber',
            0x8822: 'ExposureProgram',
            0x8824: 'SpectralSensitivity',
            0x8827: 'ISOSpeedRatings',
            0x8828: 'OECF',
            0x9201: 'ShutterSpeedValue',
            0x9202: 'ApertureValue',
            0x9203: 'BrightnessValue',
            0x9204: 'ExposureBias',
            0x9205: 'MaxApertureValue',
            0x9206: 'SubjectDistance',
            0x9207: 'MeteringMode',
            0x9208: 'LightSource',
            0x9209: 'Flash',
            0x9214: 'SubjectArea',
            0x920a: 'FocalLength',
            0xa20b: 'FlashEnergy',
            0xa20c: 'SpatialFrequencyResponse',
            0xa20e: 'FocalPlaneXResolution',
            0xa20f: 'FocalPlaneYResolution',
            0xa210: 'FocalPlaneResolutionUnit',
            0xa214: 'SubjectLocation',
            0xa215: 'ExposureIndex',
            0xa217: 'SensingMethod',
            0xa300: 'FileSource',
            0xa301: 'SceneType',
            0xa302: 'CFAPattern',
            0xa401: 'CustomRendered',
            0xa402: 'ExposureMode',
            0xa403: 'WhiteBalance',
            0xa404: 'DigitalZoomRation',
            0xa405: 'FocalLengthIn35mmFilm',
            0xa406: 'SceneCaptureType',
            0xa407: 'GainControl',
            0xa408: 'Contrast',
            0xa409: 'Saturation',
            0xa40a: 'Sharpness',
            0xa40b: 'DeviceSettingDescription',
            0xa40c: 'SubjectDistanceRange',
            // other tags
            0xa005: 'InteroperabilityIFDPointer',
            0xa420: 'ImageUniqueID' // Identifier assigned uniquely to each image
        };
        this.TiffTags = {
            0x0100: 'ImageWidth',
            0x0101: 'ImageHeight',
            0x8769: 'ExifIFDPointer',
            0x8825: 'GPSInfoIFDPointer',
            0xa005: 'InteroperabilityIFDPointer',
            0x0102: 'BitsPerSample',
            0x0103: 'Compression',
            0x0106: 'PhotometricInterpretation',
            0x0112: 'Orientation',
            0x0115: 'SamplesPerPixel',
            0x011c: 'PlanarConfiguration',
            0x0212: 'YCbCrSubSampling',
            0x0213: 'YCbCrPositioning',
            0x011a: 'XResolution',
            0x011b: 'YResolution',
            0x0128: 'ResolutionUnit',
            0x0111: 'StripOffsets',
            0x0116: 'RowsPerStrip',
            0x0117: 'StripByteCounts',
            0x0201: 'JPEGInterchangeFormat',
            0x0202: 'JPEGInterchangeFormatLength',
            0x012d: 'TransferFunction',
            0x013e: 'WhitePoint',
            0x013f: 'PrimaryChromaticities',
            0x0211: 'YCbCrCoefficients',
            0x0214: 'ReferenceBlackWhite',
            0x0132: 'DateTime',
            0x010e: 'ImageDescription',
            0x010f: 'Make',
            0x0110: 'Model',
            0x0131: 'Software',
            0x013b: 'Artist',
            0x8298: 'Copyright'
        };
        this.GPSTags = {
            0x0000: 'GPSVersionID',
            0x0001: 'GPSLatitudeRef',
            0x0002: 'GPSLatitude',
            0x0003: 'GPSLongitudeRef',
            0x0004: 'GPSLongitude',
            0x0005: 'GPSAltitudeRef',
            0x0006: 'GPSAltitude',
            0x0007: 'GPSTimeStamp',
            0x0008: 'GPSSatellites',
            0x0009: 'GPSStatus',
            0x000a: 'GPSMeasureMode',
            0x000b: 'GPSDOP',
            0x000c: 'GPSSpeedRef',
            0x000d: 'GPSSpeed',
            0x000e: 'GPSTrackRef',
            0x000f: 'GPSTrack',
            0x0010: 'GPSImgDirectionRef',
            0x0011: 'GPSImgDirection',
            0x0012: 'GPSMapDatum',
            0x0013: 'GPSDestLatitudeRef',
            0x0014: 'GPSDestLatitude',
            0x0015: 'GPSDestLongitudeRef',
            0x0016: 'GPSDestLongitude',
            0x0017: 'GPSDestBearingRef',
            0x0018: 'GPSDestBearing',
            0x0019: 'GPSDestDistanceRef',
            0x001a: 'GPSDestDistance',
            0x001b: 'GPSProcessingMethod',
            0x001c: 'GPSAreaInformation',
            0x001d: 'GPSDateStamp',
            0x001e: 'GPSDifferential'
        };
        this.StringValues = {
            ExposureProgram: {
                0: 'Not defined',
                1: 'Manual',
                2: 'Normal program',
                3: 'Aperture priority',
                4: 'Shutter priority',
                5: 'Creative program',
                6: 'Action program',
                7: 'Portrait mode',
                8: 'Landscape mode'
            },
            MeteringMode: {
                0: 'Unknown',
                1: 'Average',
                2: 'CenterWeightedAverage',
                3: 'Spot',
                4: 'MultiSpot',
                5: 'Pattern',
                6: 'Partial',
                255: 'Other'
            },
            LightSource: {
                0: 'Unknown',
                1: 'Daylight',
                2: 'Fluorescent',
                3: 'Tungsten (incandescent light)',
                4: 'Flash',
                9: 'Fine weather',
                10: 'Cloudy weather',
                11: 'Shade',
                12: 'Daylight fluorescent (D 5700 - 7100K)',
                13: 'Day white fluorescent (N 4600 - 5400K)',
                14: 'Cool white fluorescent (W 3900 - 4500K)',
                15: 'White fluorescent (WW 3200 - 3700K)',
                17: 'Standard light A',
                18: 'Standard light B',
                19: 'Standard light C',
                20: 'D55',
                21: 'D65',
                22: 'D75',
                23: 'D50',
                24: 'ISO studio tungsten',
                255: 'Other'
            },
            Flash: {
                0x0000: 'Flash did not fire',
                0x0001: 'Flash fired',
                0x0005: 'Strobe return light not detected',
                0x0007: 'Strobe return light detected',
                0x0009: 'Flash fired, compulsory flash mode',
                0x000d: 'Flash fired, compulsory flash mode, return light not detected',
                0x000f: 'Flash fired, compulsory flash mode, return light detected',
                0x0010: 'Flash did not fire, compulsory flash mode',
                0x0018: 'Flash did not fire, auto mode',
                0x0019: 'Flash fired, auto mode',
                0x001d: 'Flash fired, auto mode, return light not detected',
                0x001f: 'Flash fired, auto mode, return light detected',
                0x0020: 'No flash function',
                0x0041: 'Flash fired, red-eye reduction mode',
                0x0045: 'Flash fired, red-eye reduction mode, return light not detected',
                0x0047: 'Flash fired, red-eye reduction mode, return light detected',
                0x0049: 'Flash fired, compulsory flash mode, red-eye reduction mode',
                0x004d: 'Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected',
                0x004f: 'Flash fired, compulsory flash mode, red-eye reduction mode, return light detected',
                0x0059: 'Flash fired, auto mode, red-eye reduction mode',
                0x005d: 'Flash fired, auto mode, return light not detected, red-eye reduction mode',
                0x005f: 'Flash fired, auto mode, return light detected, red-eye reduction mode'
            },
            SensingMethod: {
                1: 'Not defined',
                2: 'One-chip color area sensor',
                3: 'Two-chip color area sensor',
                4: 'Three-chip color area sensor',
                5: 'Color sequential area sensor',
                7: 'Trilinear sensor',
                8: 'Color sequential linear sensor'
            },
            SceneCaptureType: {
                0: 'Standard',
                1: 'Landscape',
                2: 'Portrait',
                3: 'Night scene'
            },
            SceneType: {
                1: 'Directly photographed'
            },
            CustomRendered: {
                0: 'Normal process',
                1: 'Custom process'
            },
            WhiteBalance: {
                0: 'Auto white balance',
                1: 'Manual white balance'
            },
            GainControl: {
                0: 'None',
                1: 'Low gain up',
                2: 'High gain up',
                3: 'Low gain down',
                4: 'High gain down'
            },
            Contrast: {
                0: 'Normal',
                1: 'Soft',
                2: 'Hard'
            },
            Saturation: {
                0: 'Normal',
                1: 'Low saturation',
                2: 'High saturation'
            },
            Sharpness: {
                0: 'Normal',
                1: 'Soft',
                2: 'Hard'
            },
            SubjectDistanceRange: {
                0: 'Unknown',
                1: 'Macro',
                2: 'Close view',
                3: 'Distant view'
            },
            FileSource: {
                3: 'DSC'
            },
            Components: {
                0: '',
                1: 'Y',
                2: 'Cb',
                3: 'Cr',
                4: 'R',
                5: 'G',
                6: 'B'
            }
        };
    }
    addEvent(element, event, handler) {
        if (element.addEventListener) {
            element.addEventListener(event, handler, false);
        }
        else {
            // Hello, IE!
            if (element.attachEvent) {
                element.attachEvent('on' + event, handler);
            }
        }
    }
    imageHasData(img) {
        return !!img.exifdata;
    }
    base64ToArrayBuffer(base64) {
        base64 = base64.replace(/^data:([^;]+);base64,/gim, '');
        const binary = atob(base64);
        const len = binary.length;
        const buffer = new ArrayBuffer(len);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
        }
        return buffer;
    }
    objectURLToBlob(url, callback) {
        const http = new XMLHttpRequest();
        http.open('GET', url, true);
        http.responseType = 'blob';
        http.onload = () => {
            if (http.status === 200 || http.status === 0) {
                callback(http.response);
            }
        };
        http.send();
    }
    getImageData(img, callback) {
        const handleBinaryFile = (binFile) => {
            const data = this.findEXIFinJPEG(binFile);
            const iptcdata = this.findIPTCinJPEG(binFile);
            img.exifdata = data || {};
            img.iptcdata = iptcdata || {};
            if (callback) {
                callback.call(img);
            }
        };
        if ('src' in img && img.src) {
            if (/^data:/i.test(img.src)) {
                // Data URI
                const arrayBuffer = this.base64ToArrayBuffer(img.src);
                handleBinaryFile(arrayBuffer);
            }
            else {
                if (/^blob:/i.test(img.src)) {
                    // Object URL
                    const fileReader = new FileReader();
                    fileReader.onload = (e) => {
                        handleBinaryFile(e.target.result);
                    };
                    this.objectURLToBlob(img.src, (blob) => {
                        fileReader.readAsArrayBuffer(blob);
                    });
                }
                else {
                    const http = new XMLHttpRequest();
                    http.onload = () => {
                        if (http.status === 200 || http.status === 0) {
                            handleBinaryFile(http.response);
                        }
                        else {
                            throw new Error('Could not load image');
                        }
                    };
                    http.open('GET', img.src, true);
                    http.responseType = 'arraybuffer';
                    http.send(null);
                }
            }
        }
        else {
            if (FileReader && (img instanceof Blob || img instanceof File)) {
                const fileReader = new FileReader();
                fileReader.onload = (e) => {
                    this.log('Got file of length ' + e.target.result.byteLength);
                    handleBinaryFile(e.target.result);
                };
                fileReader.readAsArrayBuffer(img);
            }
        }
    }
    findEXIFinJPEG(file) {
        const dataView = new DataView(file);
        this.log('Got file of length ' + file.byteLength);
        if (dataView.getUint8(0) !== 0xff || dataView.getUint8(1) !== 0xd8) {
            this.log('Not a valid JPEG');
            return false; // not a valid jpeg
        }
        let offset = 2;
        const length = file.byteLength;
        let marker;
        while (offset < length) {
            if (dataView.getUint8(offset) !== 0xff) {
                this.log('Not a valid marker at offset ' +
                    offset +
                    ', found: ' +
                    dataView.getUint8(offset));
                return false; // not a valid marker, something is wrong
            }
            marker = dataView.getUint8(offset + 1);
            this.log(marker);
            // we could implement handling for other markers here,
            // but we're only looking for 0xFFE1 for EXIF data
            if (marker === 225) {
                this.log('Found 0xFFE1 marker');
                return this.readEXIFData(dataView, offset + 4); // , dataView.getUint16(offset + 2) - 2);
                // offset += 2 + file.getShortAt(offset+2, true);
            }
            else {
                offset += 2 + dataView.getUint16(offset + 2);
            }
        }
    }
    findIPTCinJPEG(file) {
        const dataView = new DataView(file);
        this.log('Got file of length ' + file.byteLength);
        if (dataView.getUint8(0) !== 0xff || dataView.getUint8(1) !== 0xd8) {
            this.log('Not a valid JPEG');
            return false; // not a valid jpeg
        }
        let offset = 2;
        const length = file.byteLength;
        // tslint:disable-next-line:variable-name
        const isFieldSegmentStart = (_dataView, _offset) => {
            return (_dataView.getUint8(_offset) === 0x38 &&
                _dataView.getUint8(_offset + 1) === 0x42 &&
                _dataView.getUint8(_offset + 2) === 0x49 &&
                _dataView.getUint8(_offset + 3) === 0x4d &&
                _dataView.getUint8(_offset + 4) === 0x04 &&
                _dataView.getUint8(_offset + 5) === 0x04);
        };
        while (offset < length) {
            if (isFieldSegmentStart(dataView, offset)) {
                // Get the length of the name header (which is padded to an even number of bytes)
                let nameHeaderLength = dataView.getUint8(offset + 7);
                if (nameHeaderLength % 2 !== 0) {
                    nameHeaderLength += 1;
                }
                // Check for pre photoshop 6 format
                if (nameHeaderLength === 0) {
                    // Always 4
                    nameHeaderLength = 4;
                }
                const startOffset = offset + 8 + nameHeaderLength;
                const sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);
                return this.readIPTCData(file, startOffset, sectionLength);
            }
            // Not the marker, continue searching
            offset++;
        }
    }
    readIPTCData(file, startOffset, sectionLength) {
        const dataView = new DataView(file);
        const data = {};
        let fieldValue;
        let fieldName;
        let dataSize;
        let segmentType;
        let segmentSize;
        let segmentStartPos = startOffset;
        while (segmentStartPos < startOffset + sectionLength) {
            if (dataView.getUint8(segmentStartPos) === 0x1c &&
                dataView.getUint8(segmentStartPos + 1) === 0x02) {
                segmentType = dataView.getUint8(segmentStartPos + 2);
                if (segmentType in this.IptcFieldMap) {
                    dataSize = dataView.getInt16(segmentStartPos + 3);
                    segmentSize = dataSize + 5;
                    fieldName = this.IptcFieldMap[segmentType];
                    fieldValue = this.getStringFromDB(dataView, segmentStartPos + 5, dataSize);
                    // Check if we already stored a value with this name
                    if (data.hasOwnProperty(fieldName)) {
                        // Value already stored with this name, create multivalue field
                        if (data[fieldName] instanceof Array) {
                            data[fieldName].push(fieldValue);
                        }
                        else {
                            data[fieldName] = [data[fieldName], fieldValue];
                        }
                    }
                    else {
                        data[fieldName] = fieldValue;
                    }
                }
            }
            segmentStartPos++;
        }
        return data;
    }
    readTags(file, tiffStart, dirStart, strings, bigEnd) {
        const entries = file.getUint16(dirStart, !bigEnd);
        const tags = {};
        let entryOffset;
        let tag;
        for (let i = 0; i < entries; i++) {
            entryOffset = dirStart + i * 12 + 2;
            tag = strings[file.getUint16(entryOffset, !bigEnd)];
            if (!tag) {
                this.log('Unknown tag: ' + file.getUint16(entryOffset, !bigEnd));
            }
            tags[tag] = this.readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
        }
        return tags;
    }
    readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
        const type = file.getUint16(entryOffset + 2, !bigEnd);
        const numValues = file.getUint32(entryOffset + 4, !bigEnd);
        const valueOffset = file.getUint32(entryOffset + 8, !bigEnd) + tiffStart;
        let offset;
        let vals;
        let val;
        let n;
        let numerator;
        let denominator;
        switch (type) {
            case 1: // byte, 8-bit unsigned int
            case 7: // undefined, 8-bit byte, value depending on field
                if (numValues === 1) {
                    return file.getUint8(entryOffset + 8, !bigEnd);
                }
                else {
                    offset = numValues > 4 ? valueOffset : entryOffset + 8;
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getUint8(offset + n);
                    }
                    return vals;
                }
            case 2: // ascii, 8-bit byte
                offset = numValues > 4 ? valueOffset : entryOffset + 8;
                return this.getStringFromDB(file, offset, numValues - 1);
            case 3: // short, 16 bit int
                if (numValues === 1) {
                    return file.getUint16(entryOffset + 8, !bigEnd);
                }
                else {
                    offset = numValues > 2 ? valueOffset : entryOffset + 8;
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getUint16(offset + 2 * n, !bigEnd);
                    }
                    return vals;
                }
            case 4: // long, 32 bit int
                if (numValues === 1) {
                    return file.getUint32(entryOffset + 8, !bigEnd);
                }
                else {
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getUint32(valueOffset + 4 * n, !bigEnd);
                    }
                    return vals;
                }
            case 5: // rational = two long values, first is numerator, second is denominator
                if (numValues === 1) {
                    numerator = file.getUint32(valueOffset, !bigEnd);
                    denominator = file.getUint32(valueOffset + 4, !bigEnd);
                    val = new Fraction(numerator / denominator);
                    val.numerator = numerator;
                    val.denominator = denominator;
                    return val;
                }
                else {
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        numerator = file.getUint32(valueOffset + 8 * n, !bigEnd);
                        denominator = file.getUint32(valueOffset + 4 + 8 * n, !bigEnd);
                        vals[n] = new Fraction(numerator / denominator);
                        vals[n].numerator = numerator;
                        vals[n].denominator = denominator;
                    }
                    return vals;
                }
            case 9: // slong, 32 bit signed int
                if (numValues === 1) {
                    return file.getInt32(entryOffset + 8, !bigEnd);
                }
                else {
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getInt32(valueOffset + 4 * n, !bigEnd);
                    }
                    return vals;
                }
            case 10: // signed rational, two slongs, first is numerator, second is denominator
                if (numValues === 1) {
                    return (file.getInt32(valueOffset, !bigEnd) /
                        file.getInt32(valueOffset + 4, !bigEnd));
                }
                else {
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] =
                            file.getInt32(valueOffset + 8 * n, !bigEnd) /
                                file.getInt32(valueOffset + 4 + 8 * n, !bigEnd);
                    }
                    return vals;
                }
            default:
                break;
        }
    }
    getStringFromDB(buffer, start, length) {
        let outstr = '';
        for (let n = start; n < start + length; n++) {
            outstr += String.fromCharCode(buffer.getUint8(n));
        }
        return outstr;
    }
    readEXIFData(file, start) {
        if (this.getStringFromDB(file, start, 4) !== 'Exif') {
            this.log('Not valid EXIF data! ' + this.getStringFromDB(file, start, 4));
            return false;
        }
        let bigEnd;
        let tags;
        let tag;
        let exifData;
        let gpsData;
        const tiffOffset = start + 6;
        // test for TIFF validity and endianness
        if (file.getUint16(tiffOffset) === 0x4949) {
            bigEnd = false;
        }
        else {
            if (file.getUint16(tiffOffset) === 0x4d4d) {
                bigEnd = true;
            }
            else {
                this.log('Not valid TIFF data! (no 0x4949 or 0x4D4D)');
                return false;
            }
        }
        if (file.getUint16(tiffOffset + 2, !bigEnd) !== 0x002a) {
            this.log('Not valid TIFF data! (no 0x002A)');
            return false;
        }
        const firstIFDOffset = file.getUint32(tiffOffset + 4, !bigEnd);
        if (firstIFDOffset < 0x00000008) {
            this.log('Not valid TIFF data! (First offset less than 8)', file.getUint32(tiffOffset + 4, !bigEnd));
            return false;
        }
        tags = this.readTags(file, tiffOffset, tiffOffset + firstIFDOffset, this.TiffTags, bigEnd);
        if (tags.ExifIFDPointer) {
            exifData = this.readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, this.Tags, bigEnd);
            for (tag in exifData) {
                if ({}.hasOwnProperty.call(exifData, tag)) {
                    switch (tag) {
                        case 'LightSource':
                        case 'Flash':
                        case 'MeteringMode':
                        case 'ExposureProgram':
                        case 'SensingMethod':
                        case 'SceneCaptureType':
                        case 'SceneType':
                        case 'CustomRendered':
                        case 'WhiteBalance':
                        case 'GainControl':
                        case 'Contrast':
                        case 'Saturation':
                        case 'Sharpness':
                        case 'SubjectDistanceRange':
                        case 'FileSource':
                            exifData[tag] = this.StringValues[tag][exifData[tag]];
                            break;
                        case 'ExifVersion':
                        case 'FlashpixVersion':
                            exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
                            break;
                        case 'ComponentsConfiguration':
                            const compopents = 'Components';
                            exifData[tag] =
                                this.StringValues[compopents][exifData[tag][0]] +
                                    this.StringValues[compopents][exifData[tag][1]] +
                                    this.StringValues[compopents][exifData[tag][2]] +
                                    this.StringValues[compopents][exifData[tag][3]];
                            break;
                        default:
                            break;
                    }
                    tags[tag] = exifData[tag];
                }
            }
        }
        if (tags.GPSInfoIFDPointer) {
            gpsData = this.readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, this.GPSTags, bigEnd);
            for (tag in gpsData) {
                if ({}.hasOwnProperty.call(gpsData, tag)) {
                    switch (tag) {
                        case 'GPSVersionID':
                            gpsData[tag] =
                                gpsData[tag][0] +
                                    '.' +
                                    gpsData[tag][1] +
                                    '.' +
                                    gpsData[tag][2] +
                                    '.' +
                                    gpsData[tag][3];
                            break;
                        default:
                            break;
                    }
                    tags[tag] = gpsData[tag];
                }
            }
        }
        return tags;
    }
    //   get rid of this silly issue
    checkImageType(img) {
        return img instanceof Image || img instanceof HTMLImageElement;
    }
    getData(img, callback) {
        if (this.checkImageType(img) && !img.complete) {
            return false;
        }
        if (!this.imageHasData(img)) {
            this.getImageData(img, callback);
        }
        else {
            if (callback) {
                callback.call(img);
            }
        }
        return true;
    }
    getTag(img, tag) {
        if (!this.imageHasData(img)) {
            return;
        }
        return img.exifdata[tag];
    }
    getAllTags(img) {
        if (!this.imageHasData(img)) {
            return {};
        }
        let a;
        const data = img.exifdata;
        const tags = {};
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                tags[a] = data[a];
            }
        }
        return tags;
    }
    pretty(img) {
        if (!this.imageHasData(img)) {
            return '';
        }
        let a;
        const data = img.exifdata;
        let strPretty = '';
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                if (typeof data[a] === 'object') {
                    if (data[a] instanceof Number) {
                        strPretty += `${a} : ${data[a]} [${data[a].numerator}/${data[a].denominator}]\r\n`;
                    }
                    else {
                        strPretty += `${a} : [${data[a].length} values]\r\n`;
                    }
                }
                else {
                    strPretty += `${a} : ${data[a]}\r\n`;
                }
            }
        }
        return strPretty;
    }
    readFromBinaryFile(file) {
        return this.findEXIFinJPEG(file);
    }
    log(...args) {
        if (this.debug) {
            console.log(args);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhpZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1pbWctY3JvcHBlci9zcmMvbGliL2ltYWdlLWNyb3BwZXIvZXhpZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLE9BQU8sUUFBUyxTQUFRLE1BQU07Q0FHbkM7QUFPRCxNQUFNLE9BQU8sSUFBSTtJQUFqQjtRQUNTLFVBQUssR0FBRyxLQUFLLENBQUM7UUFFZCxpQkFBWSxHQUFRO1lBQ3pCLElBQUksRUFBRSxTQUFTO1lBQ2YsSUFBSSxFQUFFLFFBQVE7WUFDZCxJQUFJLEVBQUUsVUFBVTtZQUNoQixJQUFJLEVBQUUsYUFBYTtZQUNuQixJQUFJLEVBQUUsUUFBUTtZQUNkLElBQUksRUFBRSxhQUFhO1lBQ25CLElBQUksRUFBRSxlQUFlO1lBQ3JCLElBQUksRUFBRSxVQUFVO1lBQ2hCLElBQUksRUFBRSxXQUFXO1lBQ2pCLElBQUksRUFBRSxVQUFVO1NBQ2pCLENBQUM7UUFFSyxTQUFJLEdBQVE7WUFDakIsZUFBZTtZQUNmLE1BQU0sRUFBRSxhQUFhO1lBQ3JCLE1BQU0sRUFBRSxpQkFBaUI7WUFFekIsa0JBQWtCO1lBQ2xCLE1BQU0sRUFBRSxZQUFZO1lBRXBCLHNCQUFzQjtZQUN0QixNQUFNLEVBQUUsaUJBQWlCO1lBQ3pCLE1BQU0sRUFBRSxpQkFBaUI7WUFDekIsTUFBTSxFQUFFLHlCQUF5QjtZQUNqQyxNQUFNLEVBQUUsd0JBQXdCO1lBRWhDLG1CQUFtQjtZQUNuQixNQUFNLEVBQUUsV0FBVztZQUNuQixNQUFNLEVBQUUsYUFBYTtZQUVyQixlQUFlO1lBQ2YsTUFBTSxFQUFFLGtCQUFrQjtZQUUxQixnQkFBZ0I7WUFDaEIsTUFBTSxFQUFFLGtCQUFrQjtZQUMxQixNQUFNLEVBQUUsbUJBQW1CO1lBQzNCLE1BQU0sRUFBRSxZQUFZO1lBQ3BCLE1BQU0sRUFBRSxvQkFBb0I7WUFDNUIsTUFBTSxFQUFFLHFCQUFxQjtZQUU3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YXRvcjogbnVtYmVyO1xuICBkZW5vbWluYXRvcjogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElJbWFnZUV4dGVuZGVkIGV4dGVuZHMgSFRNTEltYWdlRWxlbWVudCB7XG4gIGV4aWZkYXRhOiBhbnk7XG4gIGlwdGNkYXRhOiBhbnk7XG59XG5cbmV4cG9ydCBjbGFzcyBFeGlmIHtcbiAgcHVibGljIGRlYnVnID0gZmFsc2U7XG5cbiAgcHVibGljIElwdGNGaWVsZE1hcDogYW55ID0ge1xuICAgIDB4Nzg6ICdjYXB0aW9uJyxcbiAgICAweDZlOiAnY3JlZGl0JyxcbiAgICAweDE5OiAna2V5d29yZHMnLFxuICAgIDB4Mzc6ICdkYXRlQ3JlYXRlZCcsXG4gICAgMHg1MDogJ2J5bGluZScsXG4gICAgMHg1NTogJ2J5bGluZVRpdGxlJyxcbiAgICAweDdhOiAnY2FwdGlvbldyaXRlcicsXG4gICAgMHg2OTogJ2hlYWRsaW5lJyxcbiAgICAweDc0OiAnY29weXJpZ2h0JyxcbiAgICAweDBmOiAnY2F0ZWdvcnknXG4gIH07XG5cbiAgcHVibGljIFRhZ3M6IGFueSA9IHtcbiAgICAvLyB2ZXJzaW9uIHRhZ3NcbiAgICAweDkwMDA6ICdFeGlmVmVyc2lvbicsIC8vIEVYSUYgdmVyc2lvblxuICAgIDB4YTAwMDogJ0ZsYXNocGl4VmVyc2lvbicsIC8vIEZsYXNocGl4IGZvcm1hdCB2ZXJzaW9uXG5cbiAgICAvLyBjb2xvcnNwYWNlIHRhZ3NcbiAgICAweGEwMDE6ICdDb2xvclNwYWNlJywgLy8gQ29sb3Igc3BhY2UgaW5mb3JtYXRpb24gdGFnXG5cbiAgICAvLyBpbWFnZSBjb25maWd1cmF0aW9uXG4gICAgMHhhMDAyOiAnUGl4ZWxYRGltZW5zaW9uJywgLy8gVmFsaWQgd2lkdGggb2YgbWVhbmluZ2Z1bCBpbWFnZVxuICAgIDB4YTAwMzogJ1BpeGVsWURpbWVuc2lvbicsIC8vIFZhbGlkIGhlaWdodCBvZiBtZWFuaW5nZnVsIGltYWdlXG4gICAgMHg5MTAxOiAnQ29tcG9uZW50c0NvbmZpZ3VyYXRpb24nLCAvLyBJbmZvcm1hdGlvbiBhYm91dCBjaGFubmVsc1xuICAgIDB4OTEwMjogJ0NvbXByZXNzZWRCaXRzUGVyUGl4ZWwnLCAvLyBDb21wcmVzc2VkIGJpdHMgcGVyIHBpeGVsXG5cbiAgICAvLyB1c2VyIGluZm9ybWF0aW9uXG4gICAgMHg5MjdjOiAnTWFrZXJOb3RlJywgLy8gQW55IGRlc2lyZWQgaW5mb3JtYXRpb24gd3JpdHRlbiBieSB0aGUgbWFudWZhY3R1cmVyXG4gICAgMHg5Mjg2OiAnVXNlckNvbW1lbnQnLCAvLyBDb21tZW50cyBieSB1c2VyXG5cbiAgICAvLyByZWxhdGVkIGZpbGVcbiAgICAweGEwMDQ6ICdSZWxhdGVkU291bmRGaWxlJywgLy8gTmFtZSBvZiByZWxhdGVkIHNvdW5kIGZpbGVcblxuICAgIC8vIGRhdGUgYW5kIHRpbWVcbiAgICAweDkwMDM6ICdEYXRlVGltZU9yaWdpbmFsJywgLy8gRGF0ZSBhbmQgdGltZSB3aGVuIHRoZSBvcmlnaW5hbCBpbWFnZSB3YXMgZ2VuZXJhdGVkXG4gICAgMHg5MDA0OiAnRGF0ZVRpbWVEaWdpdGl6ZWQnLCAvLyBEYXRlIGFuZCB0aW1lIHdoZW4gdGhlIGltYWdlIHdhcyBzdG9yZWQgZGlnaXRhbGx5XG4gICAgMHg5MjkwOiAnU3Vic2VjVGltZScsIC8vIEZyYWN0aW9ucyBvZiBzZWNvbmRzIGZvciBEYXRlVGltZVxuICAgIDB4OTI5MTogJ1N1YnNlY1RpbWVPcmlnaW5hbCcsIC8vIEZyYWN0aW9ucyBvZiBzZWNvbmRzIGZvciBEYXRlVGltZU9yaWdpbmFsXG4gICAgMHg5MjkyOiAnU3Vic2VjVGltZURpZ2l0aXplZCcsIC8vIEZyYWN0aW9ucyBvZiBzZWNvbmRzIGZvciBEYXRlVGltZURpZ2l0aXplZFxuXG4gICAgLy8gcGljdHVyZS10YWtpbmcgY29uZGl0aW9uc1xuICAgIDB4ODI5YTogJ0V4cG9zdXJlVGltZScsIC8vIEV4cG9zdXJlIHRpbWUgKGluIHNlY29uZHMpXG4gICAgMHg4MjlkOiAnRk51bWJlcicsIC8vIEYgbnVtYmVyXG4gICAgMHg4ODIyOiAnRXhwb3N1cmVQcm9ncmFtJywgLy8gRXhwb3N1cmUgcHJvZ3JhbVxuICAgIDB4ODgyNDogJ1NwZWN0cmFsU2Vuc2l0aXZpdHknLCAvLyBTcGVjdHJhbCBzZW5zaXRpdml0eVxuICAgIDB4ODgyNzogJ0lTT1NwZWVkUmF0aW5ncycsIC8vIElTTyBzcGVlZCByYXRpbmdcbiAgICAweDg4Mjg6ICdPRUNGJywgLy8gT3B0b2VsZWN0cmljIGNvbnZlcnNpb24gZmFjdG9yXG4gICAgMHg5MjAxOiAnU2h1dHRlclNwZWVkVmFsdWUnLCAvLyBTaHV0dGVyIHNwZWVkXG4gICAgMHg5MjAyOiAnQXBlcnR1cmVWYWx1ZScsIC8vIExlbnMgYXBlcnR1cmVcbiAgICAweDkyMDM6ICdCcmlnaHRuZXNzVmFsdWUnLCAvLyBWYWx1ZSBvZiBicmlnaHRuZXNzXG4gICAgMHg5MjA0OiAnRXhwb3N1cmVCaWFzJywgLy8gRXhwb3N1cmUgYmlhc1xuICAgIDB4OTIwNTogJ01heEFwZXJ0dXJlVmFsdWUnLCAvLyBTbWFsbGVzdCBGIG51bWJlciBvZiBsZW5zXG4gICAgMHg5MjA2OiAnU3ViamVjdERpc3RhbmNlJywgLy8gRGlzdGFuY2UgdG8gc3ViamVjdCBpbiBtZXRlcnNcbiAgICAweDkyMDc6ICdNZXRlcmluZ01vZGUnLCAvLyBNZXRlcmluZyBtb2RlXG4gICAgMHg5MjA4OiAnTGlnaHRTb3VyY2UnLCAvLyBLaW5kIG9mIGxpZ2h0IHNvdXJjZVxuICAgIDB4OTIwOTogJ0ZsYXNoJywgLy8gRmxhc2ggc3RhdHVzXG4gICAgMHg5MjE0OiAnU3ViamVjdEFyZWEnLCAvLyBMb2NhdGlvbiBhbmQgYXJlYSBvZiBtYWluIHN1YmplY3RcbiAgICAweDkyMGE6ICdGb2NhbExlbmd0aCcsIC8vIEZvY2FsIGxlbmd0aCBvZiB0aGUgbGVucyBpbiBtbVxuICAgIDB4YTIwYjogJ0ZsYXNoRW5lcmd5JywgLy8gU3Ryb2JlIGVuZXJneSBpbiBCQ1BTXG4gICAgMHhhMjBjOiAnU3BhdGlhbEZyZXF1ZW5jeVJlc3BvbnNlJywgLy9cbiAgICAweGEyMGU6ICdGb2NhbFBsYW5lWFJlc29sdXRpb24nLCAvLyBOdW1iZXIgb2YgcGl4ZWxzIGluIHdpZHRoIGRpcmVjdGlvbiBwZXIgRm9jYWxQbGFuZVJlc29sdXRpb25Vbml0XG4gICAgMHhhMjBmOiAnRm9jYWxQbGFuZVlSZXNvbHV0aW9uJywgLy8gTnVtYmVyIG9mIHBpeGVscyBpbiBoZWlnaHQgZGlyZWN0aW9uIHBlciBGb2NhbFBsYW5lUmVzb2x1dGlvblVuaXRcbiAgICAweGEyMTA6ICdGb2NhbFBsYW5lUmVzb2x1dGlvblVuaXQnLCAvLyBVbml0IGZvciBtZWFzdXJpbmcgRm9jYWxQbGFuZVhSZXNvbHV0aW9uIGFuZCBGb2NhbFBsYW5lWVJlc29sdXRpb25cbiAgICAweGEyMTQ6ICdTdWJqZWN0TG9jYXRpb24nLCAvLyBMb2NhdGlvbiBvZiBzdWJqZWN0IGluIGltYWdlXG4gICAgMHhhMjE1OiAnRXhwb3N1cmVJbmRleCcsIC8vIEV4cG9zdXJlIGluZGV4IHNlbGVjdGVkIG9uIGNhbWVyYVxuICAgIDB4YTIxNzogJ1NlbnNpbmdNZXRob2QnLCAvLyBJbWFnZSBzZW5zb3IgdHlwZVxuICAgIDB4YTMwMDogJ0ZpbGVTb3VyY2UnLCAvLyBJbWFnZSBzb3VyY2UgKDMgPT0gRFNDKVxuICAgIDB4YTMwMTogJ1NjZW5lVHlwZScsIC8vIFNjZW5lIHR5cGUgKDEgPT0gZGlyZWN0bHkgcGhvdG9ncmFwaGVkKVxuICAgIDB4YTMwMjogJ0NGQVBhdHRlcm4nLCAvLyBDb2xvciBmaWx0ZXIgYXJyYXkgZ2VvbWV0cmljIHBhdHRlcm5cbiAgICAweGE0MDE6ICdDdXN0b21SZW5kZXJlZCcsIC8vIFNwZWNpYWwgcHJvY2Vzc2luZ1xuICAgIDB4YTQwMjogJ0V4cG9zdXJlTW9kZScsIC8vIEV4cG9zdXJlIG1vZGVcbiAgICAweGE0MDM6ICdXaGl0ZUJhbGFuY2UnLCAvLyAxID0gYXV0byB3aGl0ZSBiYWxhbmNlLCAyID0gbWFudWFsXG4gICAgMHhhNDA0OiAnRGlnaXRhbFpvb21SYXRpb24nLCAvLyBEaWdpdGFsIHpvb20gcmF0aW9cbiAgICAweGE0MDU6ICdGb2NhbExlbmd0aEluMzVtbUZpbG0nLCAvLyBFcXVpdmFsZW50IGZvYWNsIGxlbmd0aCBhc3N1bWluZyAzNW1tIGZpbG0gY2FtZXJhIChpbiBtbSlcbiAgICAweGE0MDY6ICdTY2VuZUNhcHR1cmVUeXBlJywgLy8gVHlwZSBvZiBzY2VuZVxuICAgIDB4YTQwNzogJ0dhaW5Db250cm9sJywgLy8gRGVncmVlIG9mIG92ZXJhbGwgaW1hZ2UgZ2FpbiBhZGp1c3RtZW50XG4gICAgMHhhNDA4OiAnQ29udHJhc3QnLCAvLyBEaXJlY3Rpb24gb2YgY29udHJhc3QgcHJvY2Vzc2luZyBhcHBsaWVkIGJ5IGNhbWVyYVxuICAgIDB4YTQwOTogJ1NhdHVyYXRpb24nLCAvLyBEaXJlY3Rpb24gb2Ygc2F0dXJhdGlvbiBwcm9jZXNzaW5nIGFwcGxpZWQgYnkgY2FtZXJhXG4gICAgMHhhNDBhOiAnU2hhcnBuZXNzJywgLy8gRGlyZWN0aW9uIG9mIHNoYXJwbmVzcyBwcm9jZXNzaW5nIGFwcGxpZWQgYnkgY2FtZXJhXG4gICAgMHhhNDBiOiAnRGV2aWNlU2V0dGluZ0Rlc2NyaXB0aW9uJywgLy9cbiAgICAweGE0MGM6ICdTdWJqZWN0RGlzdGFuY2VSYW5nZScsIC8vIERpc3RhbmNlIHRvIHN1YmplY3RcblxuICAgIC8vIG90aGVyIHRhZ3NcbiAgICAweGEwMDU6ICdJbnRlcm9wZXJhYmlsaXR5SUZEUG9pbnRlcicsXG4gICAgMHhhNDIwOiAnSW1hZ2VVbmlxdWVJRCcgLy8gSWRlbnRpZmllciBhc3NpZ25lZCB1bmlxdWVseSB0byBlYWNoIGltYWdlXG4gIH07XG5cbiAgcHVibGljIFRpZmZUYWdzOiBhbnkgPSB7XG4gICAgMHgwMTAwOiAnSW1hZ2VXaWR0aCcsXG4gICAgMHgwMTAxOiAnSW1hZ2VIZWlnaHQnLFxuICAgIDB4ODc2OTogJ0V4aWZJRkRQb2ludGVyJyxcbiAgICAweDg4MjU6ICdHUFNJbmZvSUZEUG9pbnRlcicsXG4gICAgMHhhMDA1OiAnSW50ZXJvcGVyYWJpbGl0eUlGRFBvaW50ZXInLFxuICAgIDB4MDEwMjogJ0JpdHNQZXJTYW1wbGUnLFxuICAgIDB4MDEwMzogJ0NvbXByZXNzaW9uJyxcbiAgICAweDAxMDY6ICdQaG90b21ldHJpY0ludGVycHJldGF0aW9uJyxcbiAgICAweDAxMTI6ICdPcmllbnRhdGlvbicsXG4gICAgMHgwMTE1OiAnU2FtcGxlc1BlclBpeGVsJyxcbiAgICAweDAxMWM6ICdQbGFuYXJDb25maWd1cmF0aW9uJyxcbiAgICAweDAyMTI6ICdZQ2JDclN1YlNhbXBsaW5nJyxcbiAgICAweDAyMTM6ICdZQ2JDclBvc2l0aW9uaW5nJyxcbiAgICAweDAxMWE6ICdYUmVzb2x1dGlvbicsXG4gICAgMHgwMTFiOiAnWVJlc29sdXRpb24nLFxuICAgIDB4MDEyODogJ1Jlc29sdXRpb25Vbml0JyxcbiAgICAweDAxMTE6ICdTdHJpcE9mZnNldHMnLFxuICAgIDB4MDExNjogJ1Jvd3NQZXJTdHJpcCcsXG4gICAgMHgwMTE3OiAnU3RyaXBCeXRlQ291bnRzJyxcbiAgICAweDAyMDE6ICdKUEVHSW50ZXJjaGFuZ2VGb3JtYXQnLFxuICAgIDB4MDIwMjogJ0pQRUdJbnRlcmNoYW5nZUZvcm1hdExlbmd0aCcsXG4gICAgMHgwMTJkOiAnVHJhbnNmZXJGdW5jdGlvbicsXG4gICAgMHgwMTNlOiAnV2hpdGVQb2ludCcsXG4gICAgMHgwMTNmOiAnUHJpbWFyeUNocm9tYXRpY2l0aWVzJyxcbiAgICAweDAyMTE6ICdZQ2JDckNvZWZmaWNpZW50cycsXG4gICAgMHgwMjE0OiAnUmVmZXJlbmNlQmxhY2tXaGl0ZScsXG4gICAgMHgwMTMyOiAnRGF0ZVRpbWUnLFxuICAgIDB4MDEwZTogJ0ltYWdlRGVzY3JpcHRpb24nLFxuICAgIDB4MDEwZjogJ01ha2UnLFxuICAgIDB4MDExMDogJ01vZGVsJyxcbiAgICAweDAxMzE6ICdTb2Z0d2FyZScsXG4gICAgMHgwMTNiOiAnQXJ0aXN0JyxcbiAgICAweDgyOTg6ICdDb3B5cmlnaHQnXG4gIH07XG5cbiAgcHVibGljIEdQU1RhZ3M6IGFueSA9IHtcbiAgICAweDAwMDA6ICdHUFNWZXJzaW9uSUQnLFxuICAgIDB4MDAwMTogJ0dQU0xhdGl0dWRlUmVmJyxcbiAgICAweDAwMDI6ICdHUFNMYXRpdHVkZScsXG4gICAgMHgwMDAzOiAnR1BTTG9uZ2l0dWRlUmVmJyxcbiAgICAweDAwMDQ6ICdHUFNMb25naXR1ZGUnLFxuICAgIDB4MDAwNTogJ0dQU0FsdGl0dWRlUmVmJyxcbiAgICAweDAwMDY6ICdHUFNBbHRpdHVkZScsXG4gICAgMHgwMDA3OiAnR1BTVGltZVN0YW1wJyxcbiAgICAweDAwMDg6ICdHUFNTYXRlbGxpdGVzJyxcbiAgICAweDAwMDk6ICdHUFNTdGF0dXMnLFxuICAgIDB4MDAwYTogJ0dQU01lYXN1cmVNb2RlJyxcbiAgICAweDAwMGI6ICdHUFNET1AnLFxuICAgIDB4MDAwYzogJ0dQU1NwZWVkUmVmJyxcbiAgICAweDAwMGQ6ICdHUFNTcGVlZCcsXG4gICAgMHgwMDBlOiAnR1BTVHJhY2tSZWYnLFxuICAgIDB4MDAwZjogJ0dQU1RyYWNrJyxcbiAgICAweDAwMTA6ICdHUFNJbWdEaXJlY3Rpb25SZWYnLFxuICAgIDB4MDAxMTogJ0dQU0ltZ0RpcmVjdGlvbicsXG4gICAgMHgwMDEyOiAnR1BTTWFwRGF0dW0nLFxuICAgIDB4MDAxMzogJ0dQU0Rlc3RMYXRpdHVkZVJlZicsXG4gICAgMHgwMDE0OiAnR1BTRGVzdExhdGl0dWRlJyxcbiAgICAweDAwMTU6ICdHUFNEZXN0TG9uZ2l0dWRlUmVmJyxcbiAgICAweDAwMTY6ICdHUFNEZXN0TG9uZ2l0dWRlJyxcbiAgICAweDAwMTc6ICdHUFNEZXN0QmVhcmluZ1JlZicsXG4gICAgMHgwMDE4OiAnR1BTRGVzdEJlYXJpbmcnLFxuICAgIDB4MDAxOTogJ0dQU0Rlc3REaXN0YW5jZVJlZicsXG4gICAgMHgwMDFhOiAnR1BTRGVzdERpc3RhbmNlJyxcbiAgICAweDAwMWI6ICdHUFNQcm9jZXNzaW5nTWV0aG9kJyxcbiAgICAweDAwMWM6ICdHUFNBcmVhSW5mb3JtYXRpb24nLFxuICAgIDB4MDAxZDogJ0dQU0RhdGVTdGFtcCcsXG4gICAgMHgwMDFlOiAnR1BTRGlmZmVyZW50aWFsJ1xuICB9O1xuXG4gIHB1YmxpYyBTdHJpbmdWYWx1ZXM6IGFueSA9IHtcbiAgICBFeHBvc3VyZVByb2dyYW06IHtcbiAgICAgIDA6ICdOb3QgZGVmaW5lZCcsXG4gICAgICAxOiAnTWFudWFsJyxcbiAgICAgIDI6ICdOb3JtYWwgcHJvZ3JhbScsXG4gICAgICAzOiAnQXBlcnR1cmUgcHJpb3JpdHknLFxuICAgICAgNDogJ1NodXR0ZXIgcHJpb3JpdHknLFxuICAgICAgNTogJ0NyZWF0aXZlIHByb2dyYW0nLFxuICAgICAgNjogJ0FjdGlvbiBwcm9ncmFtJyxcbiAgICAgIDc6ICdQb3J0cmFpdCBtb2RlJyxcbiAgICAgIDg6ICdMYW5kc2NhcGUgbW9kZSdcbiAgICB9LFxuICAgIE1ldGVyaW5nTW9kZToge1xuICAgICAgMDogJ1Vua25vd24nLFxuICAgICAgMTogJ0F2ZXJhZ2UnLFxuICAgICAgMjogJ0NlbnRlcldlaWdodGVkQXZlcmFnZScsXG4gICAgICAzOiAnU3BvdCcsXG4gICAgICA0OiAnTXVsdGlTcG90JyxcbiAgICAgIDU6ICdQYXR0ZXJuJyxcbiAgICAgIDY6ICdQYXJ0aWFsJyxcbiAgICAgIDI1NTogJ090aGVyJ1xuICAgIH0sXG4gICAgTGlnaHRTb3VyY2U6IHtcbiAgICAgIDA6ICdVbmtub3duJyxcbiAgICAgIDE6ICdEYXlsaWdodCcsXG4gICAgICAyOiAnRmx1b3Jlc2NlbnQnLFxuICAgICAgMzogJ1R1bmdzdGVuIChpbmNhbmRlc2NlbnQgbGlnaHQpJyxcbiAgICAgIDQ6ICdGbGFzaCcsXG4gICAgICA5OiAnRmluZSB3ZWF0aGVyJyxcbiAgICAgIDEwOiAnQ2xvdWR5IHdlYXRoZXInLFxuICAgICAgMTE6ICdTaGFkZScsXG4gICAgICAxMjogJ0RheWxpZ2h0IGZsdW9yZXNjZW50IChEIDU3MDAgLSA3MTAwSyknLFxuICAgICAgMTM6ICdEYXkgd2hpdGUgZmx1b3Jlc2NlbnQgKE4gNDYwMCAtIDU0MDBLKScsXG4gICAgICAxNDogJ0Nvb2wgd2hpdGUgZmx1b3Jlc2NlbnQgKFcgMzkwMCAtIDQ1MDBLKScsXG4gICAgICAxNTogJ1doaXRlIGZsdW9yZXNjZW50IChXVyAzMjAwIC0gMzcwMEspJyxcbiAgICAgIDE3OiAnU3RhbmRhcmQgbGlnaHQgQScsXG4gICAgICAxODogJ1N0YW5kYXJkIGxpZ2h0IEInLFxuICAgICAgMTk6ICdTdGFuZGFyZCBsaWdodCBDJyxcbiAgICAgIDIwOiAnRDU1JyxcbiAgICAgIDIxOiAnRDY1JyxcbiAgICAgIDIyOiAnRDc1JyxcbiAgICAgIDIzOiAnRDUwJyxcbiAgICAgIDI0OiAnSVNPIHN0dWRpbyB0dW5nc3RlbicsXG4gICAgICAyNTU6ICdPdGhlcidcbiAgICB9LFxuICAgIEZsYXNoOiB7XG4gICAgICAweDAwMDA6ICdGbGFzaCBkaWQgbm90IGZpcmUnLFxuICAgICAgMHgwMDAxOiAnRmxhc2ggZmlyZWQnLFxuICAgICAgMHgwMDA1OiAnU3Ryb2JlIHJldHVybiBsaWdodCBub3QgZGV0ZWN0ZWQnLFxuICAgICAgMHgwMDA3OiAnU3Ryb2JlIHJldHVybiBsaWdodCBkZXRlY3RlZCcsXG4gICAgICAweDAwMDk6ICdGbGFzaCBmaXJlZCwgY29tcHVsc29yeSBmbGFzaCBtb2RlJyxcbiAgICAgIDB4MDAwZDogJ0ZsYXNoIGZpcmVkLCBjb21wdWxzb3J5IGZsYXNoIG1vZGUsIHJldHVybiBsaWdodCBub3QgZGV0ZWN0ZWQnLFxuICAgICAgMHgwMDBmOiAnRmxhc2ggZmlyZWQsIGNvbXB1bHNvcnkgZmxhc2ggbW9kZSwgcmV0dXJuIGxpZ2h0IGRldGVjdGVkJyxcbiAgICAgIDB4MDAxMDogJ0ZsYXNoIGRpZCBub3QgZmlyZSwgY29tcHVsc29yeSBmbGFzaCBtb2RlJyxcbiAgICAgIDB4MDAxODogJ0ZsYXNoIGRpZCBub3QgZmlyZSwgYXV0byBtb2RlJyxcbiAgICAgIDB4MDAxOTogJ0ZsYXNoIGZpcmVkLCBhdXRvIG1vZGUnLFxuICAgICAgMHgwMDFkOiAnRmxhc2ggZmlyZWQsIGF1dG8gbW9kZSwgcmV0dXJuIGxpZ2h0IG5vdCBkZXRlY3RlZCcsXG4gICAgICAweDAwMWY6ICdGbGFzaCBmaXJlZCwgYXV0byBtb2RlLCByZXR1cm4gbGlnaHQgZGV0ZWN0ZWQnLFxuICAgICAgMHgwMDIwOiAnTm8gZmxhc2ggZnVuY3Rpb24nLFxuICAgICAgMHgwMDQxOiAnRmxhc2ggZmlyZWQsIHJlZC1leWUgcmVkdWN0aW9uIG1vZGUnLFxuICAgICAgMHgwMDQ1OiAnRmxhc2ggZmlyZWQsIHJlZC1leWUgcmVkdWN0aW9uIG1vZGUsIHJldHVybiBsaWdodCBub3QgZGV0ZWN0ZWQnLFxuICAgICAgMHgwMDQ3OiAnRmxhc2ggZmlyZWQsIHJlZC1leWUgcmVkdWN0aW9uIG1vZGUsIHJldHVybiBsaWdodCBkZXRlY3RlZCcsXG4gICAgICAweDAwNDk6ICdGbGFzaCBmaXJlZCwgY29tcHVsc29yeSBmbGFzaCBtb2RlLCByZWQtZXllIHJlZHVjdGlvbiBtb2RlJyxcbiAgICAgIDB4MDA0ZDogJ0ZsYXNoIGZpcmVkLCBjb21wdWxzb3J5IGZsYXNoIG1vZGUsIHJlZC1leWUgcmVkdWN0aW9uIG1vZGUsIHJldHVybiBsaWdodCBub3QgZGV0ZWN0ZWQnLFxuICAgICAgMHgwMDRmOiAnRmxhc2ggZmlyZWQsIGNvbXB1bHNvcnkgZmxhc2ggbW9kZSwgcmVkLWV5ZSByZWR1Y3Rpb24gbW9kZSwgcmV0dXJuIGxpZ2h0IGRldGVjdGVkJyxcbiAgICAgIDB4MDA1OTogJ0ZsYXNoIGZpcmVkLCBhdXRvIG1vZGUsIHJlZC1leWUgcmVkdWN0aW9uIG1vZGUnLFxuICAgICAgMHgwMDVkOiAnRmxhc2ggZmlyZWQsIGF1dG8gbW9kZSwgcmV0dXJuIGxpZ2h0IG5vdCBkZXRlY3RlZCwgcmVkLWV5ZSByZWR1Y3Rpb24gbW9kZScsXG4gICAgICAweDAwNWY6ICdGbGFzaCBmaXJlZCwgYXV0byBtb2RlLCByZXR1cm4gbGlnaHQgZGV0ZWN0ZWQsIHJlZC1leWUgcmVkdWN0aW9uIG1vZGUnXG4gICAgfSxcbiAgICBTZW5zaW5nTWV0aG9kOiB7XG4gICAgICAxOiAnTm90IGRlZmluZWQnLFxuICAgICAgMjogJ09uZS1jaGlwIGNvbG9yIGFyZWEgc2Vuc29yJyxcbiAgICAgIDM6ICdUd28tY2hpcCBjb2xvciBhcmVhIHNlbnNvcicsXG4gICAgICA0OiAnVGhyZWUtY2hpcCBjb2xvciBhcmVhIHNlbnNvcicsXG4gICAgICA1OiAnQ29sb3Igc2VxdWVudGlhbCBhcmVhIHNlbnNvcicsXG4gICAgICA3OiAnVHJpbGluZWFyIHNlbnNvcicsXG4gICAgICA4OiAnQ29sb3Igc2VxdWVudGlhbCBsaW5lYXIgc2Vuc29yJ1xuICAgIH0sXG4gICAgU2NlbmVDYXB0dXJlVHlwZToge1xuICAgICAgMDogJ1N0YW5kYXJkJyxcbiAgICAgIDE6ICdMYW5kc2NhcGUnLFxuICAgICAgMjogJ1BvcnRyYWl0JyxcbiAgICAgIDM6ICdOaWdodCBzY2VuZSdcbiAgICB9LFxuICAgIFNjZW5lVHlwZToge1xuICAgICAgMTogJ0RpcmVjdGx5IHBob3RvZ3JhcGhlZCdcbiAgICB9LFxuICAgIEN1c3RvbVJlbmRlcmVkOiB7XG4gICAgICAwOiAnTm9ybWFsIHByb2Nlc3MnLFxuICAgICAgMTogJ0N1c3RvbSBwcm9jZXNzJ1xuICAgIH0sXG4gICAgV2hpdGVCYWxhbmNlOiB7XG4gICAgICAwOiAnQXV0byB3aGl0ZSBiYWxhbmNlJyxcbiAgICAgIDE6ICdNYW51YWwgd2hpdGUgYmFsYW5jZSdcbiAgICB9LFxuICAgIEdhaW5Db250cm9sOiB7XG4gICAgICAwOiAnTm9uZScsXG4gICAgICAxOiAnTG93IGdhaW4gdXAnLFxuICAgICAgMjogJ0hpZ2ggZ2FpbiB1cCcsXG4gICAgICAzOiAnTG93IGdhaW4gZG93bicsXG4gICAgICA0OiAnSGlnaCBnYWluIGRvd24nXG4gICAgfSxcbiAgICBDb250cmFzdDoge1xuICAgICAgMDogJ05vcm1hbCcsXG4gICAgICAxOiAnU29mdCcsXG4gICAgICAyOiAnSGFyZCdcbiAgICB9LFxuICAgIFNhdHVyYXRpb246IHtcbiAgICAgIDA6ICdOb3JtYWwnLFxuICAgICAgMTogJ0xvdyBzYXR1cmF0aW9uJyxcbiAgICAgIDI6ICdIaWdoIHNhdHVyYXRpb24nXG4gICAgfSxcbiAgICBTaGFycG5lc3M6IHtcbiAgICAgIDA6ICdOb3JtYWwnLFxuICAgICAgMTogJ1NvZnQnLFxuICAgICAgMjogJ0hhcmQnXG4gICAgfSxcbiAgICBTdWJqZWN0RGlzdGFuY2VSYW5nZToge1xuICAgICAgMDogJ1Vua25vd24nLFxuICAgICAgMTogJ01hY3JvJyxcbiAgICAgIDI6ICdDbG9zZSB2aWV3JyxcbiAgICAgIDM6ICdEaXN0YW50IHZpZXcnXG4gICAgfSxcbiAgICBGaWxlU291cmNlOiB7XG4gICAgICAzOiAnRFNDJ1xuICAgIH0sXG5cbiAgICBDb21wb25lbnRzOiB7XG4gICAgICAwOiAnJyxcbiAgICAgIDE6ICdZJyxcbiAgICAgIDI6ICdDYicsXG4gICAgICAzOiAnQ3InLFxuICAgICAgNDogJ1InLFxuICAgICAgNTogJ0cnLFxuICAgICAgNjogJ0InXG4gICAgfVxuICB9O1xuXG4gIHB1YmxpYyBhZGRFdmVudChcbiAgICBlbGVtZW50OiBFdmVudFRhcmdldCB8IGFueSxcbiAgICBldmVudDogc3RyaW5nLFxuICAgIGhhbmRsZXI6IEV2ZW50TGlzdGVuZXJcbiAgKSB7XG4gICAgaWYgKGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEhlbGxvLCBJRSFcbiAgICAgIGlmIChlbGVtZW50LmF0dGFjaEV2ZW50KSB7XG4gICAgICAgIGVsZW1lbnQuYXR0YWNoRXZlbnQoJ29uJyArIGV2ZW50LCBoYW5kbGVyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaW1hZ2VIYXNEYXRhKGltZzogSUltYWdlRXh0ZW5kZWQpIHtcbiAgICByZXR1cm4gISFpbWcuZXhpZmRhdGE7XG4gIH1cblxuICBwdWJsaWMgYmFzZTY0VG9BcnJheUJ1ZmZlcihiYXNlNjQ6IHN0cmluZyk6IEFycmF5QnVmZmVyIHtcbiAgICBiYXNlNjQgPSBiYXNlNjQucmVwbGFjZSgvXmRhdGE6KFteO10rKTtiYXNlNjQsL2dpbSwgJycpO1xuICAgIGNvbnN0IGJpbmFyeTogc3RyaW5nID0gYXRvYihiYXNlNjQpO1xuICAgIGNvbnN0IGxlbjogbnVtYmVyID0gYmluYXJ5Lmxlbmd0aDtcbiAgICBjb25zdCBidWZmZXI6IEFycmF5QnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKGxlbik7XG4gICAgY29uc3QgdmlldzogVWludDhBcnJheSA9IG5ldyBVaW50OEFycmF5KGJ1ZmZlcik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgdmlld1tpXSA9IGJpbmFyeS5jaGFyQ29kZUF0KGkpO1xuICAgIH1cbiAgICByZXR1cm4gYnVmZmVyO1xuICB9XG5cbiAgcHVibGljIG9iamVjdFVSTFRvQmxvYih1cmw6IHN0cmluZywgY2FsbGJhY2s6IChibG9iOiBCbG9iKSA9PiB2b2lkKSB7XG4gICAgY29uc3QgaHR0cDogWE1MSHR0cFJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICBodHRwLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gICAgaHR0cC5yZXNwb25zZVR5cGUgPSAnYmxvYic7XG4gICAgaHR0cC5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICBpZiAoaHR0cC5zdGF0dXMgPT09IDIwMCB8fCBodHRwLnN0YXR1cyA9PT0gMCkge1xuICAgICAgICBjYWxsYmFjayhodHRwLnJlc3BvbnNlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGh0dHAuc2VuZCgpO1xuICB9XG5cbiAgcHVibGljIGdldEltYWdlRGF0YShcbiAgICBpbWc6IElJbWFnZUV4dGVuZGVkIHwgQmxvYiB8IEZpbGUsXG4gICAgY2FsbGJhY2s6IChpbWc6IElJbWFnZUV4dGVuZGVkKSA9PiB2b2lkXG4gICkge1xuICAgIGNvbnN0IGhhbmRsZUJpbmFyeUZpbGUgPSAoYmluRmlsZTogQXJyYXlCdWZmZXIpID0+IHtcbiAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmZpbmRFWElGaW5KUEVHKGJpbkZpbGUpO1xuICAgICAgY29uc3QgaXB0Y2RhdGEgPSB0aGlzLmZpbmRJUFRDaW5KUEVHKGJpbkZpbGUpO1xuICAgICAgKGltZyBhcyBJSW1hZ2VFeHRlbmRlZCkuZXhpZmRhdGEgPSBkYXRhIHx8IHt9O1xuICAgICAgKGltZyBhcyBJSW1hZ2VFeHRlbmRlZCkuaXB0Y2RhdGEgPSBpcHRjZGF0YSB8fCB7fTtcbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjay5jYWxsKGltZyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmICgnc3JjJyBpbiBpbWcgJiYgKGltZyBhcyBJSW1hZ2VFeHRlbmRlZCkuc3JjKSB7XG4gICAgICBpZiAoL15kYXRhOi9pLnRlc3QoKGltZyBhcyBJSW1hZ2VFeHRlbmRlZCkuc3JjKSkge1xuICAgICAgICAvLyBEYXRhIFVSSVxuICAgICAgICBjb25zdCBhcnJheUJ1ZmZlciA9IHRoaXMuYmFzZTY0VG9BcnJheUJ1ZmZlcihcbiAgICAgICAgICAoaW1nIGFzIElJbWFnZUV4dGVuZGVkKS5zcmNcbiAgICAgICAgKTtcbiAgICAgICAgaGFuZGxlQmluYXJ5RmlsZShhcnJheUJ1ZmZlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoL15ibG9iOi9pLnRlc3QoKGltZyBhcyBJSW1hZ2VFeHRlbmRlZCkuc3JjKSkge1xuICAgICAgICAgIC8vIE9iamVjdCBVUkxcbiAgICAgICAgICBjb25zdCBmaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgICBmaWxlUmVhZGVyLm9ubG9hZCA9IChlOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGhhbmRsZUJpbmFyeUZpbGUoZS50YXJnZXQucmVzdWx0KTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIHRoaXMub2JqZWN0VVJMVG9CbG9iKChpbWcgYXMgSUltYWdlRXh0ZW5kZWQpLnNyYywgKGJsb2I6IEJsb2IpID0+IHtcbiAgICAgICAgICAgIGZpbGVSZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoYmxvYik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgaHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgIGh0dHAub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGh0dHAuc3RhdHVzID09PSAyMDAgfHwgaHR0cC5zdGF0dXMgPT09IDApIHtcbiAgICAgICAgICAgICAgaGFuZGxlQmluYXJ5RmlsZShodHRwLnJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGxvYWQgaW1hZ2UnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICAgIGh0dHAub3BlbignR0VUJywgKGltZyBhcyBJSW1hZ2VFeHRlbmRlZCkuc3JjLCB0cnVlKTtcbiAgICAgICAgICBodHRwLnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcic7XG4gICAgICAgICAgaHR0cC5zZW5kKG51bGwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChGaWxlUmVhZGVyICYmIChpbWcgaW5zdGFuY2VvZiBCbG9iIHx8IGltZyBpbnN0YW5jZW9mIEZpbGUpKSB7XG4gICAgICAgIGNvbnN0IGZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICBmaWxlUmVhZGVyLm9ubG9hZCA9IChlOiBhbnkpID0+IHtcbiAgICAgICAgICB0aGlzLmxvZygnR290IGZpbGUgb2YgbGVuZ3RoICcgKyBlLnRhcmdldC5yZXN1bHQuYnl0ZUxlbmd0aCk7XG4gICAgICAgICAgaGFuZGxlQmluYXJ5RmlsZShlLnRhcmdldC5yZXN1bHQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZpbGVSZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoaW1nKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZmluZEVYSUZpbkpQRUcoZmlsZTogQXJyYXlCdWZmZXIpIHtcbiAgICBjb25zdCBkYXRhVmlldyA9IG5ldyBEYXRhVmlldyhmaWxlKTtcblxuICAgIHRoaXMubG9nKCdHb3QgZmlsZSBvZiBsZW5ndGggJyArIGZpbGUuYnl0ZUxlbmd0aCk7XG4gICAgaWYgKGRhdGFWaWV3LmdldFVpbnQ4KDApICE9PSAweGZmIHx8IGRhdGFWaWV3LmdldFVpbnQ4KDEpICE9PSAweGQ4KSB7XG4gICAgICB0aGlzLmxvZygnTm90IGEgdmFsaWQgSlBFRycpO1xuICAgICAgcmV0dXJuIGZhbHNlOyAvLyBub3QgYSB2YWxpZCBqcGVnXG4gICAgfVxuXG4gICAgbGV0IG9mZnNldCA9IDI7XG4gICAgY29uc3QgbGVuZ3RoOiBudW1iZXIgPSBmaWxlLmJ5dGVMZW5ndGg7XG4gICAgbGV0IG1hcmtlcjogbnVtYmVyO1xuXG4gICAgd2hpbGUgKG9mZnNldCA8IGxlbmd0aCkge1xuICAgICAgaWYgKGRhdGFWaWV3LmdldFVpbnQ4KG9mZnNldCkgIT09IDB4ZmYpIHtcbiAgICAgICAgdGhpcy5sb2coXG4gICAgICAgICAgJ05vdCBhIHZhbGlkIG1hcmtlciBhdCBvZmZzZXQgJyArXG4gICAgICAgICAgICBvZmZzZXQgK1xuICAgICAgICAgICAgJywgZm91bmQ6ICcgK1xuICAgICAgICAgICAgZGF0YVZpZXcuZ2V0VWludDgob2Zmc2V0KVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gZmFsc2U7IC8vIG5vdCBhIHZhbGlkIG1hcmtlciwgc29tZXRoaW5nIGlzIHdyb25nXG4gICAgICB9XG5cbiAgICAgIG1hcmtlciA9IGRhdGFWaWV3LmdldFVpbnQ4KG9mZnNldCArIDEpO1xuICAgICAgdGhpcy5sb2cobWFya2VyKTtcblxuICAgICAgLy8gd2UgY291bGQgaW1wbGVtZW50IGhhbmRsaW5nIGZvciBvdGhlciBtYXJrZXJzIGhlcmUsXG4gICAgICAvLyBidXQgd2UncmUgb25seSBsb29raW5nIGZvciAweEZGRTEgZm9yIEVYSUYgZGF0YVxuICAgICAgaWYgKG1hcmtlciA9PT0gMjI1KSB7XG4gICAgICAgIHRoaXMubG9nKCdGb3VuZCAweEZGRTEgbWFya2VyJyk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlYWRFWElGRGF0YShkYXRhVmlldywgb2Zmc2V0ICsgNCk7IC8vICwgZGF0YVZpZXcuZ2V0VWludDE2KG9mZnNldCArIDIpIC0gMik7XG4gICAgICAgIC8vIG9mZnNldCArPSAyICsgZmlsZS5nZXRTaG9ydEF0KG9mZnNldCsyLCB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9mZnNldCArPSAyICsgZGF0YVZpZXcuZ2V0VWludDE2KG9mZnNldCArIDIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBmaW5kSVBUQ2luSlBFRyhmaWxlOiBBcnJheUJ1ZmZlcikge1xuICAgIGNvbnN0IGRhdGFWaWV3ID0gbmV3IERhdGFWaWV3KGZpbGUpO1xuXG4gICAgdGhpcy5sb2coJ0dvdCBmaWxlIG9mIGxlbmd0aCAnICsgZmlsZS5ieXRlTGVuZ3RoKTtcbiAgICBpZiAoZGF0YVZpZXcuZ2V0VWludDgoMCkgIT09IDB4ZmYgfHwgZGF0YVZpZXcuZ2V0VWludDgoMSkgIT09IDB4ZDgpIHtcbiAgICAgIHRoaXMubG9nKCdOb3QgYSB2YWxpZCBKUEVHJyk7XG4gICAgICByZXR1cm4gZmFsc2U7IC8vIG5vdCBhIHZhbGlkIGpwZWdcbiAgICB9XG5cbiAgICBsZXQgb2Zmc2V0ID0gMjtcbiAgICBjb25zdCBsZW5ndGggPSBmaWxlLmJ5dGVMZW5ndGg7XG5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICAgIGNvbnN0IGlzRmllbGRTZWdtZW50U3RhcnQgPSAoX2RhdGFWaWV3OiBEYXRhVmlldywgX29mZnNldDogbnVtYmVyKSA9PiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBfZGF0YVZpZXcuZ2V0VWludDgoX29mZnNldCkgPT09IDB4MzggJiZcbiAgICAgICAgX2RhdGFWaWV3LmdldFVpbnQ4KF9vZmZzZXQgKyAxKSA9PT0gMHg0MiAmJlxuICAgICAgICBfZGF0YVZpZXcuZ2V0VWludDgoX29mZnNldCArIDIpID09PSAweDQ5ICYmXG4gICAgICAgIF9kYXRhVmlldy5nZXRVaW50OChfb2Zmc2V0ICsgMykgPT09IDB4NGQgJiZcbiAgICAgICAgX2RhdGFWaWV3LmdldFVpbnQ4KF9vZmZzZXQgKyA0KSA9PT0gMHgwNCAmJlxuICAgICAgICBfZGF0YVZpZXcuZ2V0VWludDgoX29mZnNldCArIDUpID09PSAweDA0XG4gICAgICApO1xuICAgIH07XG5cbiAgICB3aGlsZSAob2Zmc2V0IDwgbGVuZ3RoKSB7XG4gICAgICBpZiAoaXNGaWVsZFNlZ21lbnRTdGFydChkYXRhVmlldywgb2Zmc2V0KSkge1xuICAgICAgICAvLyBHZXQgdGhlIGxlbmd0aCBvZiB0aGUgbmFtZSBoZWFkZXIgKHdoaWNoIGlzIHBhZGRlZCB0byBhbiBldmVuIG51bWJlciBvZiBieXRlcylcbiAgICAgICAgbGV0IG5hbWVIZWFkZXJMZW5ndGggPSBkYXRhVmlldy5nZXRVaW50OChvZmZzZXQgKyA3KTtcbiAgICAgICAgaWYgKG5hbWVIZWFkZXJMZW5ndGggJSAyICE9PSAwKSB7XG4gICAgICAgICAgbmFtZUhlYWRlckxlbmd0aCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIC8vIENoZWNrIGZvciBwcmUgcGhvdG9zaG9wIDYgZm9ybWF0XG4gICAgICAgIGlmIChuYW1lSGVhZGVyTGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgLy8gQWx3YXlzIDRcbiAgICAgICAgICBuYW1lSGVhZGVyTGVuZ3RoID0gNDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN0YXJ0T2Zmc2V0ID0gb2Zmc2V0ICsgOCArIG5hbWVIZWFkZXJMZW5ndGg7XG4gICAgICAgIGNvbnN0IHNlY3Rpb25MZW5ndGggPSBkYXRhVmlldy5nZXRVaW50MTYob2Zmc2V0ICsgNiArIG5hbWVIZWFkZXJMZW5ndGgpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnJlYWRJUFRDRGF0YShmaWxlLCBzdGFydE9mZnNldCwgc2VjdGlvbkxlbmd0aCk7XG4gICAgICB9XG5cbiAgICAgIC8vIE5vdCB0aGUgbWFya2VyLCBjb250aW51ZSBzZWFyY2hpbmdcbiAgICAgIG9mZnNldCsrO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByZWFkSVBUQ0RhdGEoXG4gICAgZmlsZTogQXJyYXlCdWZmZXIsXG4gICAgc3RhcnRPZmZzZXQ6IG51bWJlcixcbiAgICBzZWN0aW9uTGVuZ3RoOiBudW1iZXJcbiAgKSB7XG4gICAgY29uc3QgZGF0YVZpZXcgPSBuZXcgRGF0YVZpZXcoZmlsZSk7XG4gICAgY29uc3QgZGF0YTogYW55ID0ge307XG4gICAgbGV0IGZpZWxkVmFsdWU6IGFueTtcbiAgICBsZXQgZmllbGROYW1lOiBzdHJpbmc7XG4gICAgbGV0IGRhdGFTaXplOiBudW1iZXI7XG4gICAgbGV0IHNlZ21lbnRUeXBlOiBhbnk7XG4gICAgbGV0IHNlZ21lbnRTaXplOiBudW1iZXI7XG4gICAgbGV0IHNlZ21lbnRTdGFydFBvcyA9IHN0YXJ0T2Zmc2V0O1xuICAgIHdoaWxlIChzZWdtZW50U3RhcnRQb3MgPCBzdGFydE9mZnNldCArIHNlY3Rpb25MZW5ndGgpIHtcbiAgICAgIGlmIChcbiAgICAgICAgZGF0YVZpZXcuZ2V0VWludDgoc2VnbWVudFN0YXJ0UG9zKSA9PT0gMHgxYyAmJlxuICAgICAgICBkYXRhVmlldy5nZXRVaW50OChzZWdtZW50U3RhcnRQb3MgKyAxKSA9PT0gMHgwMlxuICAgICAgKSB7XG4gICAgICAgIHNlZ21lbnRUeXBlID0gZGF0YVZpZXcuZ2V0VWludDgoc2VnbWVudFN0YXJ0UG9zICsgMik7XG4gICAgICAgIGlmIChzZWdtZW50VHlwZSBpbiB0aGlzLklwdGNGaWVsZE1hcCkge1xuICAgICAgICAgIGRhdGFTaXplID0gZGF0YVZpZXcuZ2V0SW50MTYoc2VnbWVudFN0YXJ0UG9zICsgMyk7XG4gICAgICAgICAgc2VnbWVudFNpemUgPSBkYXRhU2l6ZSArIDU7XG4gICAgICAgICAgZmllbGROYW1lID0gdGhpcy5JcHRjRmllbGRNYXBbc2VnbWVudFR5cGVdO1xuICAgICAgICAgIGZpZWxkVmFsdWUgPSB0aGlzLmdldFN0cmluZ0Zyb21EQihcbiAgICAgICAgICAgIGRhdGFWaWV3LFxuICAgICAgICAgICAgc2VnbWVudFN0YXJ0UG9zICsgNSxcbiAgICAgICAgICAgIGRhdGFTaXplXG4gICAgICAgICAgKTtcbiAgICAgICAgICAvLyBDaGVjayBpZiB3ZSBhbHJlYWR5IHN0b3JlZCBhIHZhbHVlIHdpdGggdGhpcyBuYW1lXG4gICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoZmllbGROYW1lKSkge1xuICAgICAgICAgICAgLy8gVmFsdWUgYWxyZWFkeSBzdG9yZWQgd2l0aCB0aGlzIG5hbWUsIGNyZWF0ZSBtdWx0aXZhbHVlIGZpZWxkXG4gICAgICAgICAgICBpZiAoZGF0YVtmaWVsZE5hbWVdIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgZGF0YVtmaWVsZE5hbWVdLnB1c2goZmllbGRWYWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBkYXRhW2ZpZWxkTmFtZV0gPSBbZGF0YVtmaWVsZE5hbWVdLCBmaWVsZFZhbHVlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGF0YVtmaWVsZE5hbWVdID0gZmllbGRWYWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHNlZ21lbnRTdGFydFBvcysrO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkVGFncyhcbiAgICBmaWxlOiBEYXRhVmlldyxcbiAgICB0aWZmU3RhcnQ6IG51bWJlcixcbiAgICBkaXJTdGFydDogbnVtYmVyLFxuICAgIHN0cmluZ3M6IHN0cmluZ1tdLFxuICAgIGJpZ0VuZDogYm9vbGVhblxuICApOiBhbnkge1xuICAgIGNvbnN0IGVudHJpZXM6IG51bWJlciA9IGZpbGUuZ2V0VWludDE2KGRpclN0YXJ0LCAhYmlnRW5kKTtcbiAgICBjb25zdCB0YWdzOiBhbnkgPSB7fTtcbiAgICBsZXQgZW50cnlPZmZzZXQ6IG51bWJlcjtcbiAgICBsZXQgdGFnOiBzdHJpbmc7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudHJpZXM7IGkrKykge1xuICAgICAgZW50cnlPZmZzZXQgPSBkaXJTdGFydCArIGkgKiAxMiArIDI7XG4gICAgICB0YWcgPSBzdHJpbmdzW2ZpbGUuZ2V0VWludDE2KGVudHJ5T2Zmc2V0LCAhYmlnRW5kKV07XG4gICAgICBpZiAoIXRhZykge1xuICAgICAgICB0aGlzLmxvZygnVW5rbm93biB0YWc6ICcgKyBmaWxlLmdldFVpbnQxNihlbnRyeU9mZnNldCwgIWJpZ0VuZCkpO1xuICAgICAgfVxuICAgICAgdGFnc1t0YWddID0gdGhpcy5yZWFkVGFnVmFsdWUoXG4gICAgICAgIGZpbGUsXG4gICAgICAgIGVudHJ5T2Zmc2V0LFxuICAgICAgICB0aWZmU3RhcnQsXG4gICAgICAgIGRpclN0YXJ0LFxuICAgICAgICBiaWdFbmRcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB0YWdzO1xuICB9XG5cbiAgcHVibGljIHJlYWRUYWdWYWx1ZShcbiAgICBmaWxlOiBhbnksXG4gICAgZW50cnlPZmZzZXQ6IG51bWJlcixcbiAgICB0aWZmU3RhcnQ6IG51bWJlcixcbiAgICBkaXJTdGFydDogbnVtYmVyLFxuICAgIGJpZ0VuZDogYm9vbGVhblxuICApOiBhbnkge1xuICAgIGNvbnN0IHR5cGU6IG51bWJlciA9IGZpbGUuZ2V0VWludDE2KGVudHJ5T2Zmc2V0ICsgMiwgIWJpZ0VuZCk7XG4gICAgY29uc3QgbnVtVmFsdWVzID0gZmlsZS5nZXRVaW50MzIoZW50cnlPZmZzZXQgKyA0LCAhYmlnRW5kKTtcbiAgICBjb25zdCB2YWx1ZU9mZnNldCA9IGZpbGUuZ2V0VWludDMyKGVudHJ5T2Zmc2V0ICsgOCwgIWJpZ0VuZCkgKyB0aWZmU3RhcnQ7XG4gICAgbGV0IG9mZnNldDogbnVtYmVyO1xuICAgIGxldCB2YWxzOiBhbnlbXTtcbiAgICBsZXQgdmFsOiBhbnk7XG4gICAgbGV0IG46IG51bWJlcjtcbiAgICBsZXQgbnVtZXJhdG9yOiBhbnk7XG4gICAgbGV0IGRlbm9taW5hdG9yOiBhbnk7XG5cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgMTogLy8gYnl0ZSwgOC1iaXQgdW5zaWduZWQgaW50XG4gICAgICBjYXNlIDc6IC8vIHVuZGVmaW5lZCwgOC1iaXQgYnl0ZSwgdmFsdWUgZGVwZW5kaW5nIG9uIGZpZWxkXG4gICAgICAgIGlmIChudW1WYWx1ZXMgPT09IDEpIHtcbiAgICAgICAgICByZXR1cm4gZmlsZS5nZXRVaW50OChlbnRyeU9mZnNldCArIDgsICFiaWdFbmQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9mZnNldCA9IG51bVZhbHVlcyA+IDQgPyB2YWx1ZU9mZnNldCA6IGVudHJ5T2Zmc2V0ICsgODtcbiAgICAgICAgICB2YWxzID0gW107XG4gICAgICAgICAgZm9yIChuID0gMDsgbiA8IG51bVZhbHVlczsgbisrKSB7XG4gICAgICAgICAgICB2YWxzW25dID0gZmlsZS5nZXRVaW50OChvZmZzZXQgKyBuKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHZhbHM7XG4gICAgICAgIH1cblxuICAgICAgY2FzZSAyOiAvLyBhc2NpaSwgOC1iaXQgYnl0ZVxuICAgICAgICBvZmZzZXQgPSBudW1WYWx1ZXMgPiA0ID8gdmFsdWVPZmZzZXQgOiBlbnRyeU9mZnNldCArIDg7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFN0cmluZ0Zyb21EQihmaWxlLCBvZmZzZXQsIG51bVZhbHVlcyAtIDEpO1xuXG4gICAgICBjYXNlIDM6IC8vIHNob3J0LCAxNiBiaXQgaW50XG4gICAgICAgIGlmIChudW1WYWx1ZXMgPT09IDEpIHtcbiAgICAgICAgICByZXR1cm4gZmlsZS5nZXRVaW50MTYoZW50cnlPZmZzZXQgKyA4LCAhYmlnRW5kKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvZmZzZXQgPSBudW1WYWx1ZXMgPiAyID8gdmFsdWVPZmZzZXQgOiBlbnRyeU9mZnNldCArIDg7XG4gICAgICAgICAgdmFscyA9IFtdO1xuICAgICAgICAgIGZvciAobiA9IDA7IG4gPCBudW1WYWx1ZXM7IG4rKykge1xuICAgICAgICAgICAgdmFsc1tuXSA9IGZpbGUuZ2V0VWludDE2KG9mZnNldCArIDIgKiBuLCAhYmlnRW5kKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHZhbHM7XG4gICAgICAgIH1cblxuICAgICAgY2FzZSA0OiAvLyBsb25nLCAzMiBiaXQgaW50XG4gICAgICAgIGlmIChudW1WYWx1ZXMgPT09IDEpIHtcbiAgICAgICAgICByZXR1cm4gZmlsZS5nZXRVaW50MzIoZW50cnlPZmZzZXQgKyA4LCAhYmlnRW5kKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWxzID0gW107XG4gICAgICAgICAgZm9yIChuID0gMDsgbiA8IG51bVZhbHVlczsgbisrKSB7XG4gICAgICAgICAgICB2YWxzW25dID0gZmlsZS5nZXRVaW50MzIodmFsdWVPZmZzZXQgKyA0ICogbiwgIWJpZ0VuZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB2YWxzO1xuICAgICAgICB9XG5cbiAgICAgIGNhc2UgNTogLy8gcmF0aW9uYWwgPSB0d28gbG9uZyB2YWx1ZXMsIGZpcnN0IGlzIG51bWVyYXRvciwgc2Vjb25kIGlzIGRlbm9taW5hdG9yXG4gICAgICAgIGlmIChudW1WYWx1ZXMgPT09IDEpIHtcbiAgICAgICAgICBudW1lcmF0b3IgPSBmaWxlLmdldFVpbnQzMih2YWx1ZU9mZnNldCwgIWJpZ0VuZCk7XG4gICAgICAgICAgZGVub21pbmF0b3IgPSBmaWxlLmdldFVpbnQzMih2YWx1ZU9mZnNldCArIDQsICFiaWdFbmQpO1xuICAgICAgICAgIHZhbCA9IG5ldyBGcmFjdGlvbihudW1lcmF0b3IgLyBkZW5vbWluYXRvcik7XG4gICAgICAgICAgdmFsLm51bWVyYXRvciA9IG51bWVyYXRvcjtcbiAgICAgICAgICB2YWwuZGVub21pbmF0b3IgPSBkZW5vbWluYXRvcjtcbiAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHMgPSBbXTtcbiAgICAgICAgICBmb3IgKG4gPSAwOyBuIDwgbnVtVmFsdWVzOyBuKyspIHtcbiAgICAgICAgICAgIG51bWVyYXRvciA9IGZpbGUuZ2V0VWludDMyKHZhbHVlT2Zmc2V0ICsgOCAqIG4sICFiaWdFbmQpO1xuICAgICAgICAgICAgZGVub21pbmF0b3IgPSBmaWxlLmdldFVpbnQzMih2YWx1ZU9mZnNldCArIDQgKyA4ICogbiwgIWJpZ0VuZCk7XG4gICAgICAgICAgICB2YWxzW25dID0gbmV3IEZyYWN0aW9uKG51bWVyYXRvciAvIGRlbm9taW5hdG9yKTtcbiAgICAgICAgICAgIHZhbHNbbl0ubnVtZXJhdG9yID0gbnVtZXJhdG9yO1xuICAgICAgICAgICAgdmFsc1tuXS5kZW5vbWluYXRvciA9IGRlbm9taW5hdG9yO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdmFscztcbiAgICAgICAgfVxuXG4gICAgICBjYXNlIDk6IC8vIHNsb25nLCAzMiBiaXQgc2lnbmVkIGludFxuICAgICAgICBpZiAobnVtVmFsdWVzID09PSAxKSB7XG4gICAgICAgICAgcmV0dXJuIGZpbGUuZ2V0SW50MzIoZW50cnlPZmZzZXQgKyA4LCAhYmlnRW5kKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWxzID0gW107XG4gICAgICAgICAgZm9yIChuID0gMDsgbiA8IG51bVZhbHVlczsgbisrKSB7XG4gICAgICAgICAgICB2YWxzW25dID0gZmlsZS5nZXRJbnQzMih2YWx1ZU9mZnNldCArIDQgKiBuLCAhYmlnRW5kKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHZhbHM7XG4gICAgICAgIH1cblxuICAgICAgY2FzZSAxMDogLy8gc2lnbmVkIHJhdGlvbmFsLCB0d28gc2xvbmdzLCBmaXJzdCBpcyBudW1lcmF0b3IsIHNlY29uZCBpcyBkZW5vbWluYXRvclxuICAgICAgICBpZiAobnVtVmFsdWVzID09PSAxKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIGZpbGUuZ2V0SW50MzIodmFsdWVPZmZzZXQsICFiaWdFbmQpIC9cbiAgICAgICAgICAgIGZpbGUuZ2V0SW50MzIodmFsdWVPZmZzZXQgKyA0LCAhYmlnRW5kKVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFscyA9IFtdO1xuICAgICAgICAgIGZvciAobiA9IDA7IG4gPCBudW1WYWx1ZXM7IG4rKykge1xuICAgICAgICAgICAgdmFsc1tuXSA9XG4gICAgICAgICAgICAgIGZpbGUuZ2V0SW50MzIodmFsdWVPZmZzZXQgKyA4ICogbiwgIWJpZ0VuZCkgL1xuICAgICAgICAgICAgICBmaWxlLmdldEludDMyKHZhbHVlT2Zmc2V0ICsgNCArIDggKiBuLCAhYmlnRW5kKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHZhbHM7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRTdHJpbmdGcm9tREIoXG4gICAgYnVmZmVyOiBEYXRhVmlldyxcbiAgICBzdGFydDogbnVtYmVyLFxuICAgIGxlbmd0aDogbnVtYmVyXG4gICk6IHN0cmluZyB7XG4gICAgbGV0IG91dHN0ciA9ICcnO1xuICAgIGZvciAobGV0IG4gPSBzdGFydDsgbiA8IHN0YXJ0ICsgbGVuZ3RoOyBuKyspIHtcbiAgICAgIG91dHN0ciArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZmZlci5nZXRVaW50OChuKSk7XG4gICAgfVxuICAgIHJldHVybiBvdXRzdHI7XG4gIH1cblxuICBwdWJsaWMgcmVhZEVYSUZEYXRhKGZpbGU6IERhdGFWaWV3LCBzdGFydDogbnVtYmVyKTogYW55IHtcbiAgICBpZiAodGhpcy5nZXRTdHJpbmdGcm9tREIoZmlsZSwgc3RhcnQsIDQpICE9PSAnRXhpZicpIHtcbiAgICAgIHRoaXMubG9nKCdOb3QgdmFsaWQgRVhJRiBkYXRhISAnICsgdGhpcy5nZXRTdHJpbmdGcm9tREIoZmlsZSwgc3RhcnQsIDQpKTtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCBiaWdFbmQ6IGJvb2xlYW47XG4gICAgbGV0IHRhZ3M6IGFueTtcbiAgICBsZXQgdGFnOiBzdHJpbmc7XG4gICAgbGV0IGV4aWZEYXRhOiBhbnk7XG4gICAgbGV0IGdwc0RhdGE6IGFueTtcbiAgICBjb25zdCB0aWZmT2Zmc2V0OiBudW1iZXIgPSBzdGFydCArIDY7XG5cbiAgICAvLyB0ZXN0IGZvciBUSUZGIHZhbGlkaXR5IGFuZCBlbmRpYW5uZXNzXG4gICAgaWYgKGZpbGUuZ2V0VWludDE2KHRpZmZPZmZzZXQpID09PSAweDQ5NDkpIHtcbiAgICAgIGJpZ0VuZCA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZmlsZS5nZXRVaW50MTYodGlmZk9mZnNldCkgPT09IDB4NGQ0ZCkge1xuICAgICAgICBiaWdFbmQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5sb2coJ05vdCB2YWxpZCBUSUZGIGRhdGEhIChubyAweDQ5NDkgb3IgMHg0RDREKScpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGZpbGUuZ2V0VWludDE2KHRpZmZPZmZzZXQgKyAyLCAhYmlnRW5kKSAhPT0gMHgwMDJhKSB7XG4gICAgICB0aGlzLmxvZygnTm90IHZhbGlkIFRJRkYgZGF0YSEgKG5vIDB4MDAyQSknKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBmaXJzdElGRE9mZnNldCA9IGZpbGUuZ2V0VWludDMyKHRpZmZPZmZzZXQgKyA0LCAhYmlnRW5kKTtcblxuICAgIGlmIChmaXJzdElGRE9mZnNldCA8IDB4MDAwMDAwMDgpIHtcbiAgICAgIHRoaXMubG9nKFxuICAgICAgICAnTm90IHZhbGlkIFRJRkYgZGF0YSEgKEZpcnN0IG9mZnNldCBsZXNzIHRoYW4gOCknLFxuICAgICAgICBmaWxlLmdldFVpbnQzMih0aWZmT2Zmc2V0ICsgNCwgIWJpZ0VuZClcbiAgICAgICk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGFncyA9IHRoaXMucmVhZFRhZ3MoXG4gICAgICBmaWxlLFxuICAgICAgdGlmZk9mZnNldCxcbiAgICAgIHRpZmZPZmZzZXQgKyBmaXJzdElGRE9mZnNldCxcbiAgICAgIHRoaXMuVGlmZlRhZ3MsXG4gICAgICBiaWdFbmRcbiAgICApO1xuXG4gICAgaWYgKHRhZ3MuRXhpZklGRFBvaW50ZXIpIHtcbiAgICAgIGV4aWZEYXRhID0gdGhpcy5yZWFkVGFncyhcbiAgICAgICAgZmlsZSxcbiAgICAgICAgdGlmZk9mZnNldCxcbiAgICAgICAgdGlmZk9mZnNldCArIHRhZ3MuRXhpZklGRFBvaW50ZXIsXG4gICAgICAgIHRoaXMuVGFncyxcbiAgICAgICAgYmlnRW5kXG4gICAgICApO1xuICAgICAgZm9yICh0YWcgaW4gZXhpZkRhdGEpIHtcbiAgICAgICAgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoZXhpZkRhdGEsIHRhZykpIHtcbiAgICAgICAgICBzd2l0Y2ggKHRhZykge1xuICAgICAgICAgICAgY2FzZSAnTGlnaHRTb3VyY2UnOlxuICAgICAgICAgICAgY2FzZSAnRmxhc2gnOlxuICAgICAgICAgICAgY2FzZSAnTWV0ZXJpbmdNb2RlJzpcbiAgICAgICAgICAgIGNhc2UgJ0V4cG9zdXJlUHJvZ3JhbSc6XG4gICAgICAgICAgICBjYXNlICdTZW5zaW5nTWV0aG9kJzpcbiAgICAgICAgICAgIGNhc2UgJ1NjZW5lQ2FwdHVyZVR5cGUnOlxuICAgICAgICAgICAgY2FzZSAnU2NlbmVUeXBlJzpcbiAgICAgICAgICAgIGNhc2UgJ0N1c3RvbVJlbmRlcmVkJzpcbiAgICAgICAgICAgIGNhc2UgJ1doaXRlQmFsYW5jZSc6XG4gICAgICAgICAgICBjYXNlICdHYWluQ29udHJvbCc6XG4gICAgICAgICAgICBjYXNlICdDb250cmFzdCc6XG4gICAgICAgICAgICBjYXNlICdTYXR1cmF0aW9uJzpcbiAgICAgICAgICAgIGNhc2UgJ1NoYXJwbmVzcyc6XG4gICAgICAgICAgICBjYXNlICdTdWJqZWN0RGlzdGFuY2VSYW5nZSc6XG4gICAgICAgICAgICBjYXNlICdGaWxlU291cmNlJzpcbiAgICAgICAgICAgICAgZXhpZkRhdGFbdGFnXSA9IHRoaXMuU3RyaW5nVmFsdWVzW3RhZ11bZXhpZkRhdGFbdGFnXV07XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnRXhpZlZlcnNpb24nOlxuICAgICAgICAgICAgY2FzZSAnRmxhc2hwaXhWZXJzaW9uJzpcbiAgICAgICAgICAgICAgZXhpZkRhdGFbdGFnXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoXG4gICAgICAgICAgICAgICAgZXhpZkRhdGFbdGFnXVswXSxcbiAgICAgICAgICAgICAgICBleGlmRGF0YVt0YWddWzFdLFxuICAgICAgICAgICAgICAgIGV4aWZEYXRhW3RhZ11bMl0sXG4gICAgICAgICAgICAgICAgZXhpZkRhdGFbdGFnXVszXVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ0NvbXBvbmVudHNDb25maWd1cmF0aW9uJzpcbiAgICAgICAgICAgICAgY29uc3QgY29tcG9wZW50cyA9ICdDb21wb25lbnRzJztcbiAgICAgICAgICAgICAgZXhpZkRhdGFbdGFnXSA9XG4gICAgICAgICAgICAgICAgdGhpcy5TdHJpbmdWYWx1ZXNbY29tcG9wZW50c11bZXhpZkRhdGFbdGFnXVswXV0gK1xuICAgICAgICAgICAgICAgIHRoaXMuU3RyaW5nVmFsdWVzW2NvbXBvcGVudHNdW2V4aWZEYXRhW3RhZ11bMV1dICtcbiAgICAgICAgICAgICAgICB0aGlzLlN0cmluZ1ZhbHVlc1tjb21wb3BlbnRzXVtleGlmRGF0YVt0YWddWzJdXSArXG4gICAgICAgICAgICAgICAgdGhpcy5TdHJpbmdWYWx1ZXNbY29tcG9wZW50c11bZXhpZkRhdGFbdGFnXVszXV07XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRhZ3NbdGFnXSA9IGV4aWZEYXRhW3RhZ107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGFncy5HUFNJbmZvSUZEUG9pbnRlcikge1xuICAgICAgZ3BzRGF0YSA9IHRoaXMucmVhZFRhZ3MoXG4gICAgICAgIGZpbGUsXG4gICAgICAgIHRpZmZPZmZzZXQsXG4gICAgICAgIHRpZmZPZmZzZXQgKyB0YWdzLkdQU0luZm9JRkRQb2ludGVyLFxuICAgICAgICB0aGlzLkdQU1RhZ3MsXG4gICAgICAgIGJpZ0VuZFxuICAgICAgKTtcbiAgICAgIGZvciAodGFnIGluIGdwc0RhdGEpIHtcbiAgICAgICAgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoZ3BzRGF0YSwgdGFnKSkge1xuICAgICAgICAgIHN3aXRjaCAodGFnKSB7XG4gICAgICAgICAgICBjYXNlICdHUFNWZXJzaW9uSUQnOlxuICAgICAgICAgICAgICBncHNEYXRhW3RhZ10gPVxuICAgICAgICAgICAgICAgIGdwc0RhdGFbdGFnXVswXSArXG4gICAgICAgICAgICAgICAgJy4nICtcbiAgICAgICAgICAgICAgICBncHNEYXRhW3RhZ11bMV0gK1xuICAgICAgICAgICAgICAgICcuJyArXG4gICAgICAgICAgICAgICAgZ3BzRGF0YVt0YWddWzJdICtcbiAgICAgICAgICAgICAgICAnLicgK1xuICAgICAgICAgICAgICAgIGdwc0RhdGFbdGFnXVszXTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgdGFnc1t0YWddID0gZ3BzRGF0YVt0YWddO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhZ3M7XG4gIH1cblxuICAvLyAgIGdldCByaWQgb2YgdGhpcyBzaWxseSBpc3N1ZVxuICBwcml2YXRlIGNoZWNrSW1hZ2VUeXBlKGltZzogYW55KSB7XG4gICAgcmV0dXJuIGltZyBpbnN0YW5jZW9mIEltYWdlIHx8IGltZyBpbnN0YW5jZW9mIEhUTUxJbWFnZUVsZW1lbnQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0RGF0YShpbWc6IElJbWFnZUV4dGVuZGVkIHwgSFRNTEltYWdlRWxlbWVudCwgY2FsbGJhY2s6ICgpID0+IHZvaWQpIHtcbiAgICBpZiAodGhpcy5jaGVja0ltYWdlVHlwZShpbWcpICYmICFpbWcuY29tcGxldGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaW1hZ2VIYXNEYXRhKGltZyBhcyBJSW1hZ2VFeHRlbmRlZCkpIHtcbiAgICAgIHRoaXMuZ2V0SW1hZ2VEYXRhKGltZyBhcyBJSW1hZ2VFeHRlbmRlZCwgY2FsbGJhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbChpbWcpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRUYWcoaW1nOiBhbnksIHRhZzogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLmltYWdlSGFzRGF0YShpbWcpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiBpbWcuZXhpZmRhdGFbdGFnXTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRBbGxUYWdzKGltZzogYW55KSB7XG4gICAgaWYgKCF0aGlzLmltYWdlSGFzRGF0YShpbWcpKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGxldCBhOiBzdHJpbmc7XG4gICAgY29uc3QgZGF0YTogYW55ID0gaW1nLmV4aWZkYXRhO1xuICAgIGNvbnN0IHRhZ3M6IGFueSA9IHt9O1xuICAgIGZvciAoYSBpbiBkYXRhKSB7XG4gICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShhKSkge1xuICAgICAgICB0YWdzW2FdID0gZGF0YVthXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhZ3M7XG4gIH1cblxuICBwdWJsaWMgcHJldHR5KGltZzogSUltYWdlRXh0ZW5kZWQpIHtcbiAgICBpZiAoIXRoaXMuaW1hZ2VIYXNEYXRhKGltZykpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgbGV0IGE6IGFueTtcbiAgICBjb25zdCBkYXRhOiBhbnkgPSBpbWcuZXhpZmRhdGE7XG4gICAgbGV0IHN0clByZXR0eSA9ICcnO1xuICAgIGZvciAoYSBpbiBkYXRhKSB7XG4gICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShhKSkge1xuICAgICAgICBpZiAodHlwZW9mIGRhdGFbYV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgaWYgKGRhdGFbYV0gaW5zdGFuY2VvZiBOdW1iZXIpIHtcbiAgICAgICAgICAgIHN0clByZXR0eSArPSBgJHthfSA6ICR7ZGF0YVthXX0gWyR7ZGF0YVthXS5udW1lcmF0b3J9LyR7XG4gICAgICAgICAgICAgIGRhdGFbYV0uZGVub21pbmF0b3JcbiAgICAgICAgICAgIH1dXFxyXFxuYDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RyUHJldHR5ICs9IGAke2F9IDogWyR7ZGF0YVthXS5sZW5ndGh9IHZhbHVlc11cXHJcXG5gO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHJQcmV0dHkgKz0gYCR7YX0gOiAke2RhdGFbYV19XFxyXFxuYDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3RyUHJldHR5O1xuICB9XG5cbiAgcHVibGljIHJlYWRGcm9tQmluYXJ5RmlsZShmaWxlOiBBcnJheUJ1ZmZlcikge1xuICAgIHJldHVybiB0aGlzLmZpbmRFWElGaW5KUEVHKGZpbGUpO1xuICB9XG5cbiAgcHVibGljIGxvZyguLi5hcmdzOiBhbnlbXSkge1xuICAgIGlmICh0aGlzLmRlYnVnKSB7XG4gICAgICBjb25zb2xlLmxvZyhhcmdzKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==