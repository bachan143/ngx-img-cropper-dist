import * as i0 from '@angular/core';
import { EventEmitter, Component, Inject, ViewChild, Input, Output, NgModule, Injectable } from '@angular/core';
import * as i1 from '@angular/common';
import { DOCUMENT, CommonModule } from '@angular/common';

class CropperDrawSettings {
    constructor(settings) {
        this.lineDash = false;
        this.strokeWidth = 1;
        this.strokeColor = 'rgba(255,255,255,1)';
        this.fillColor = 'rgba(255,255,255,1)';
        this.dragIconStrokeWidth = 1;
        this.dragIconStrokeColor = 'rgba(0,0,0,1)';
        this.dragIconFillColor = 'rgba(255,255,255,1)';
        this.backgroundFillColor = 'rgba(0,0,0,0.6)';
        if (typeof settings === 'object') {
            this.lineDash = settings.lineDash || this.lineDash;
            this.strokeWidth = settings.strokeWidth || this.strokeWidth;
            this.fillColor = settings.fillColor || this.fillColor;
            this.strokeColor = settings.strokeColor || this.strokeColor;
            this.dragIconStrokeWidth =
                settings.dragIconStrokeWidth || this.dragIconStrokeWidth;
            this.dragIconStrokeColor =
                settings.dragIconStrokeColor || this.dragIconStrokeColor;
            this.dragIconFillColor =
                settings.dragIconFillColor || this.dragIconFillColor;
            this.backgroundFillColor =
                settings.backgroundFillColor || this.backgroundFillColor;
        }
    }
}

class CropperSettings {
    constructor(settings) {
        this.canvasWidth = 300;
        this.canvasHeight = 300;
        this.dynamicSizing = false;
        this.width = 200;
        this.height = 200;
        this.minWidth = 50;
        this.minHeight = 50;
        this.minWithRelativeToResolution = true;
        this.croppedWidth = 100;
        this.croppedHeight = 100;
        this.cropperDrawSettings = new CropperDrawSettings();
        this.touchRadius = 20;
        this.noFileInput = false;
        this.markerSizeMultiplier = 1;
        this.centerTouchRadius = 20;
        this.showCenterMarker = true;
        this.allowedFilesRegex = /\.(jpe?g|png|gif|bmp)$/i;
        this.cropOnResize = true;
        this.preserveSize = false;
        this.compressRatio = 1.0;
        this.showFullCropInitial = false;
        // tslint:disable-next-line:variable-name
        this._rounded = false;
        // tslint:disable-next-line:variable-name
        this._keepAspect = true;
        if (typeof settings === 'object') {
            Object.assign(this, settings);
        }
    }
    set rounded(val) {
        this._rounded = val;
        if (val) {
            this._keepAspect = true;
        }
    }
    get rounded() {
        return this._rounded;
    }
    set keepAspect(val) {
        this._keepAspect = val;
        if (this._rounded === true && this._keepAspect === false) {
            console.error('Cannot set keep aspect to false on rounded cropper. Ellipsis not supported');
            this._keepAspect = true;
        }
    }
    get keepAspect() {
        return this._keepAspect;
    }
}

class Fraction extends Number {
}
class Exif {
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

class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    get next() {
        return this.myNext;
    }
    set next(p) {
        this.myNext = p;
    }
    get prev() {
        return this.myPrev;
    }
    set prev(p) {
        this.myPrev = p;
    }
}

class PointPool {
    constructor(initialSize = 1) {
        let prev = (this.firstAvailable = new Point());
        for (let i = 1; i < initialSize; i++) {
            const p = new Point();
            prev.next = p;
            prev = p;
        }
    }
    get instance() {
        return this;
    }
    borrow(x, y) {
        if (this.firstAvailable == null) {
            throw new Error('Pool exhausted');
        }
        this.borrowed++;
        const p = this.firstAvailable;
        this.firstAvailable = p.next;
        p.x = x;
        p.y = y;
        return p;
    }
    returnPoint(p) {
        this.borrowed--;
        p.x = 0;
        p.y = 0;
        p.next = this.firstAvailable;
        this.firstAvailable = p;
    }
}

class Bounds {
    constructor(x, y, width, height) {
        if (x === void 0) {
            x = 0;
        }
        if (y === void 0) {
            y = 0;
        }
        if (width === void 0) {
            width = 0;
        }
        if (height === void 0) {
            height = 0;
        }
        this.left = x;
        this.right = x + width;
        this.top = y;
        this.bottom = y + height;
    }
    get width() {
        return this.right - this.left;
    }
    get height() {
        return this.bottom - this.top;
    }
    getCentre() {
        const w = this.width;
        const h = this.height;
        return new PointPool().instance.borrow(this.left + w / 2, this.top + h / 2);
    }
}

class Handle {
    constructor(x, y, radius, settings) {
        this.cropperSettings = new CropperSettings();
        this.over = false;
        this.drag = false;
        this._position = new Point(x, y);
        this.offset = new Point(0, 0);
        this.radius = radius;
        this.cropperSettings = settings;
    }
    setDrag(value) {
        this.drag = value;
        this.setOver(value);
    }
    draw(ctx) {
        // this should't be empty
    }
    setOver(over) {
        this.over = over;
    }
    touchInBounds(x, y) {
        return (x > this.position.x - this.radius + this.offset.x &&
            x < this.position.x + this.radius + this.offset.x &&
            y > this.position.y - this.radius + this.offset.y &&
            y < this.position.y + this.radius + this.offset.y);
    }
    get position() {
        return this._position;
    }
    setPosition(x, y) {
        this._position.x = x;
        this._position.y = y;
    }
}

class CornerMarker extends Handle {
    constructor(x, y, radius, cropperSettings) {
        super(x, y, radius, cropperSettings);
    }
    drawCornerBorder(ctx) {
        let sideLength = 10;
        if (this.over || this.drag) {
            sideLength = 12;
        }
        let hDirection = this.cropperSettings.markerSizeMultiplier;
        let vDirection = this.cropperSettings.markerSizeMultiplier;
        if (this.horizontalNeighbour.position.x < this.position.x) {
            hDirection = -this.cropperSettings.markerSizeMultiplier;
        }
        if (this.verticalNeighbour.position.y < this.position.y) {
            vDirection = -this.cropperSettings.markerSizeMultiplier;
        }
        ctx.beginPath();
        if (this.cropperSettings.cropperDrawSettings.lineDash) {
            ctx.setLineDash([1, 3]);
        }
        ctx.lineJoin = 'miter';
        ctx.moveTo(this.position.x + this.offset.x, this.position.y + this.offset.y);
        ctx.lineTo(this.position.x + this.offset.x + sideLength * hDirection, this.position.y + this.offset.y);
        ctx.lineTo(this.position.x + this.offset.x + sideLength * hDirection, this.position.y + this.offset.y + sideLength * vDirection);
        ctx.lineTo(this.position.x + this.offset.x, this.position.y + this.offset.y + sideLength * vDirection);
        ctx.lineTo(this.position.x + this.offset.x, this.position.y + this.offset.y);
        ctx.closePath();
        ctx.lineWidth = this.cropperSettings.cropperDrawSettings.strokeWidth;
        ctx.strokeStyle =
            this.cropperSettings.cropperDrawSettings.strokeColor ||
                'rgba(255,255,255,.7)';
        ctx.stroke();
    }
    drawCornerFill(ctx) {
        let sideLength = 10;
        if (this.over || this.drag) {
            sideLength = 12;
        }
        let hDirection = this.cropperSettings.markerSizeMultiplier;
        let vDirection = this.cropperSettings.markerSizeMultiplier;
        if (this.horizontalNeighbour.position.x < this.position.x) {
            hDirection = -this.cropperSettings.markerSizeMultiplier;
        }
        if (this.verticalNeighbour.position.y < this.position.y) {
            vDirection = -this.cropperSettings.markerSizeMultiplier;
        }
        if (this.cropperSettings.rounded) {
            const width = this.position.x - this.horizontalNeighbour.position.x;
            const height = this.position.y - this.verticalNeighbour.position.y;
            const offX = Math.round(Math.sin(Math.PI / 2) * Math.abs(width / 2)) / 4;
            const offY = Math.round(Math.sin(Math.PI / 2) * Math.abs(height / 2)) / 4;
            this.offset.x = hDirection > 0 ? offX : -offX;
            this.offset.y = vDirection > 0 ? offY : -offY;
        }
        else {
            this.offset.x = 0;
            this.offset.y = 0;
        }
        ctx.beginPath();
        if (this.cropperSettings.cropperDrawSettings.lineDash) {
            ctx.setLineDash([1, 3]);
        }
        ctx.moveTo(this.position.x + this.offset.x, this.position.y + this.offset.y);
        ctx.lineTo(this.position.x + this.offset.x + sideLength * hDirection, this.position.y + this.offset.y);
        ctx.lineTo(this.position.x + this.offset.x + sideLength * hDirection, this.position.y + this.offset.y + sideLength * vDirection);
        ctx.lineTo(this.position.x + this.offset.x, this.position.y + this.offset.y + sideLength * vDirection);
        ctx.lineTo(this.position.x + this.offset.x, this.position.y + this.offset.y);
        ctx.closePath();
        ctx.fillStyle =
            this.cropperSettings.cropperDrawSettings.fillColor ||
                'rgba(255,255,255,.7)';
        ctx.fill();
    }
    moveX(x) {
        this.setPosition(x, this.position.y);
    }
    moveY(y) {
        this.setPosition(this.position.x, y);
    }
    move(x, y) {
        this.setPosition(x, y);
        this.verticalNeighbour.moveX(x);
        this.horizontalNeighbour.moveY(y);
    }
    addHorizontalNeighbour(neighbour) {
        this.horizontalNeighbour = neighbour;
    }
    addVerticalNeighbour(neighbour) {
        this.verticalNeighbour = neighbour;
    }
    getHorizontalNeighbour() {
        return this.horizontalNeighbour;
    }
    getVerticalNeighbour() {
        return this.verticalNeighbour;
    }
    draw(ctx) {
        this.drawCornerFill(ctx);
        this.drawCornerBorder(ctx);
    }
}

class CropTouch {
    constructor(x = 0, y = 0, id = 0) {
        this.id = id;
        this.x = x;
        this.y = y;
    }
}

class DragMarker extends Handle {
    constructor(x, y, radius, cropperSettings) {
        super(x, y, radius, cropperSettings);
        this.iconPoints = [];
        this.scaledIconPoints = [];
        this.getDragIconPoints(this.iconPoints, 1);
        this.getDragIconPoints(this.scaledIconPoints, 1.2);
    }
    draw(ctx) {
        if (this.over || this.drag) {
            this.drawIcon(ctx, this.scaledIconPoints);
        }
        else {
            this.drawIcon(ctx, this.iconPoints);
        }
    }
    getDragIconPoints(arr, scale) {
        const maxLength = 17 * scale;
        const arrowWidth = 14 * scale;
        const arrowLength = 8 * scale;
        const connectorThroat = 4 * scale;
        arr.push(new PointPool().instance.borrow(-connectorThroat / 2, maxLength - arrowLength));
        arr.push(new PointPool().instance.borrow(-arrowWidth / 2, maxLength - arrowLength));
        arr.push(new PointPool().instance.borrow(0, maxLength));
        arr.push(new PointPool().instance.borrow(arrowWidth / 2, maxLength - arrowLength));
        arr.push(new PointPool().instance.borrow(connectorThroat / 2, maxLength - arrowLength));
        arr.push(new PointPool().instance.borrow(connectorThroat / 2, connectorThroat / 2));
        arr.push(new PointPool().instance.borrow(maxLength - arrowLength, connectorThroat / 2));
        arr.push(new PointPool().instance.borrow(maxLength - arrowLength, arrowWidth / 2));
        arr.push(new PointPool().instance.borrow(maxLength, 0));
        arr.push(new PointPool().instance.borrow(maxLength - arrowLength, -arrowWidth / 2));
        arr.push(new PointPool().instance.borrow(maxLength - arrowLength, -connectorThroat / 2));
        arr.push(new PointPool().instance.borrow(connectorThroat / 2, -connectorThroat / 2));
        arr.push(new PointPool().instance.borrow(connectorThroat / 2, -maxLength + arrowLength));
        arr.push(new PointPool().instance.borrow(arrowWidth / 2, -maxLength + arrowLength));
        arr.push(new PointPool().instance.borrow(0, -maxLength));
        arr.push(new PointPool().instance.borrow(-arrowWidth / 2, -maxLength + arrowLength));
        arr.push(new PointPool().instance.borrow(-connectorThroat / 2, -maxLength + arrowLength));
        arr.push(new PointPool().instance.borrow(-connectorThroat / 2, -connectorThroat / 2));
        arr.push(new PointPool().instance.borrow(-maxLength + arrowLength, -connectorThroat / 2));
        arr.push(new PointPool().instance.borrow(-maxLength + arrowLength, -arrowWidth / 2));
        arr.push(new PointPool().instance.borrow(-maxLength, 0));
        arr.push(new PointPool().instance.borrow(-maxLength + arrowLength, arrowWidth / 2));
        arr.push(new PointPool().instance.borrow(-maxLength + arrowLength, connectorThroat / 2));
        arr.push(new PointPool().instance.borrow(-connectorThroat / 2, connectorThroat / 2));
    }
    drawIcon(ctx, points) {
        if (this.cropperSettings.showCenterMarker) {
            ctx.beginPath();
            ctx.moveTo(points[0].x + this.position.x, points[0].y + this.position.y);
            for (const p of points) {
                ctx.lineTo(p.x + this.position.x, p.y + this.position.y);
            }
            ctx.closePath();
            ctx.fillStyle = this.cropperSettings.cropperDrawSettings.dragIconFillColor;
            ctx.fill();
            ctx.lineWidth = this.cropperSettings.cropperDrawSettings.dragIconStrokeWidth;
            ctx.strokeStyle = this.cropperSettings.cropperDrawSettings.dragIconStrokeColor;
            ctx.stroke();
        }
    }
    recalculatePosition(bounds) {
        const c = bounds.getCentre();
        this.setPosition(c.x, c.y);
        new PointPool().instance.returnPoint(c);
    }
}

class ImageCropperModel {
}

class ImageCropperDataShare {
    constructor() {
        this.share = {};
    }
    setPressed(canvas) {
        this.pressed = canvas;
    }
    setReleased(canvas) {
        if (canvas === this.pressed) {
            //  this.pressed = undefined;
        }
    }
    setOver(canvas) {
        this.over = canvas;
    }
    setStyle(canvas, style) {
        if (this.pressed !== undefined) {
            if (this.pressed === canvas) {
                // TODO: check this
                // angular.element(document.documentElement).css('cursor', style);
            }
        }
        else {
            if (canvas === this.over) {
                // TODO: check this
                // angular.element(document.documentElement).css('cursor', style);
            }
        }
    }
}

class ImageCropper extends ImageCropperModel {
    constructor(cropperSettings) {
        super();
        this.imageCropperDataShare = new ImageCropperDataShare();
        const x = 0;
        const y = 0;
        const width = cropperSettings.width;
        const height = cropperSettings.height;
        const keepAspect = cropperSettings.keepAspect;
        const touchRadius = cropperSettings.touchRadius;
        const centerTouchRadius = cropperSettings.centerTouchRadius;
        const minWidth = cropperSettings.minWidth;
        const minHeight = cropperSettings.minHeight;
        const croppedWidth = cropperSettings.croppedWidth;
        const croppedHeight = cropperSettings.croppedHeight;
        this.cropperSettings = cropperSettings;
        this.crop = this;
        this.x = x;
        this.y = y;
        this.canvasHeight = cropperSettings.canvasHeight;
        this.canvasWidth = cropperSettings.canvasWidth;
        this.width = width;
        if (width === void 0) {
            this.width = 100;
        }
        this.height = height;
        if (height === void 0) {
            this.height = 50;
        }
        this.keepAspect = keepAspect;
        if (keepAspect === void 0) {
            this.keepAspect = true;
        }
        this.touchRadius = touchRadius;
        if (touchRadius === void 0) {
            this.touchRadius = 20;
        }
        this.minWidth = minWidth;
        this.minHeight = minHeight;
        this.aspectRatio = 0;
        this.currentDragTouches = [];
        this.isMouseDown = false;
        this.ratioW = 1;
        this.ratioH = 1;
        this.fileType = cropperSettings.fileType;
        this.imageSet = false;
        this.pointPool = new PointPool(200);
        this.tl = new CornerMarker(x, y, touchRadius, this.cropperSettings);
        this.tr = new CornerMarker(x + width, y, touchRadius, this.cropperSettings);
        this.bl = new CornerMarker(x, y + height, touchRadius, this.cropperSettings);
        this.br = new CornerMarker(x + width, y + height, touchRadius, this.cropperSettings);
        this.tl.addHorizontalNeighbour(this.tr);
        this.tl.addVerticalNeighbour(this.bl);
        this.tr.addHorizontalNeighbour(this.tl);
        this.tr.addVerticalNeighbour(this.br);
        this.bl.addHorizontalNeighbour(this.br);
        this.bl.addVerticalNeighbour(this.tl);
        this.br.addHorizontalNeighbour(this.bl);
        this.br.addVerticalNeighbour(this.tr);
        this.markers = [this.tl, this.tr, this.bl, this.br];
        this.center = new DragMarker(x + width / 2, y + height / 2, centerTouchRadius, this.cropperSettings);
        this.aspectRatio = height / width;
        this.croppedImage = new Image();
        this.currentlyInteracting = false;
        this.cropWidth = croppedWidth;
        this.cropHeight = croppedHeight;
    }
    sign(x) {
        if (+x === x) {
            return x === 0 ? x : x > 0 ? 1 : -1;
        }
        return NaN;
    }
    getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        return new PointPool().instance.borrow(evt.clientX - rect.left, evt.clientY - rect.top);
    }
    getTouchPos(canvas, touch) {
        const rect = canvas.getBoundingClientRect();
        return new PointPool().instance.borrow(touch.clientX - rect.left, touch.clientY - rect.top);
    }
    detectVerticalSquash(img) {
        const ih = img.height;
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = ih;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, 1, ih);
        if (imageData) {
            const data = imageData.data;
            // search image edge pixel position in case it is squashed vertically.
            let sy = 0;
            let ey = ih;
            let py = ih;
            while (py > sy) {
                const alpha = data[(py - 1) * 4 + 3];
                if (alpha === 0) {
                    ey = py;
                }
                else {
                    sy = py;
                }
                // tslint:disable-next-line:no-bitwise
                py = (ey + sy) >> 1;
            }
            const ratio = py / ih;
            return ratio === 0 ? 1 : ratio;
        }
        else {
            return 1;
        }
    }
    getDataUriMimeType(dataUri) {
        // Get a substring because the regex does not perform well on very large strings.
        // Cater for optional charset. Length 50 shoould be enough.
        const dataUriSubstring = dataUri.substring(0, 50);
        let mimeType = 'image/png';
        // data-uri scheme
        // data:[<media type>][;charset=<character set>][;base64],<data>
        const regEx = RegExp(/^(data:)([\w\/\+]+);(charset=[\w-]+|base64).*,(.*)/gi);
        const matches = regEx.exec(dataUriSubstring);
        if (matches && matches[2]) {
            mimeType = matches[2];
            if (mimeType === 'image/jpg') {
                mimeType = 'image/jpeg';
            }
        }
        return mimeType;
    }
    prepare(canvas) {
        this.buffer = document.createElement('canvas');
        this.cropCanvas = document.createElement('canvas');
        // todo get more reliable parent width value.
        const responsiveWidth = canvas.parentElement
            ? canvas.parentElement.clientWidth
            : 0;
        if (responsiveWidth > 0 && this.cropperSettings.dynamicSizing) {
            this.cropCanvas.width = responsiveWidth;
            this.buffer.width = responsiveWidth;
            canvas.width = responsiveWidth;
        }
        else {
            this.cropCanvas.width = this.cropWidth;
            this.buffer.width = canvas.width;
        }
        this.cropCanvas.height = this.cropHeight;
        this.buffer.height = canvas.height;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.draw(this.ctx);
    }
    updateSettings(cropperSettings) {
        this.cropperSettings = cropperSettings;
    }
    resizeCanvas(width, height, setImage = false) {
        this.canvas.width = this.cropCanvas.width = this.width = this.canvasWidth = this.buffer.width = width;
        this.canvas.height = this.cropCanvas.height = this.height = this.canvasHeight = this.buffer.height = height;
        if (setImage) {
            this.setImage(this.srcImage);
        }
    }
    reset() {
        this.setImage(undefined);
    }
    draw(ctx) {
        const bounds = this.getBounds();
        if (this.srcImage) {
            ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            const sourceAspect = this.srcImage.height / this.srcImage.width;
            const canvasAspect = this.canvasHeight / this.canvasWidth;
            let w = this.canvasWidth;
            let h = this.canvasHeight;
            if (canvasAspect > sourceAspect) {
                w = this.canvasWidth;
                h = this.canvasWidth * sourceAspect;
            }
            else {
                h = this.canvasHeight;
                w = this.canvasHeight / sourceAspect;
            }
            this.ratioW = w / this.srcImage.width;
            this.ratioH = h / this.srcImage.height;
            if (canvasAspect < sourceAspect) {
                this.drawImageIOSFix(ctx, this.srcImage, 0, 0, this.srcImage.width, this.srcImage.height, this.buffer.width / 2 - w / 2, 0, w, h);
            }
            else {
                this.drawImageIOSFix(ctx, this.srcImage, 0, 0, this.srcImage.width, this.srcImage.height, 0, this.buffer.height / 2 - h / 2, w, h);
            }
            this.buffer.getContext('2d').drawImage(this.canvas, 0, 0, this.canvasWidth, this.canvasHeight);
            ctx.lineWidth = this.cropperSettings.cropperDrawSettings.strokeWidth;
            ctx.strokeStyle = this.cropperSettings.cropperDrawSettings.strokeColor;
            ctx.fillStyle = this.cropperSettings.cropperDrawSettings.backgroundFillColor;
            if (!this.cropperSettings.rounded) {
                ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
                ctx.drawImage(this.buffer, bounds.left, bounds.top, Math.max(bounds.width, 1), Math.max(bounds.height, 1), bounds.left, bounds.top, bounds.width, bounds.height);
                ctx.strokeRect(bounds.left, bounds.top, bounds.width, bounds.height);
            }
            else {
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.save();
                ctx.beginPath();
                ctx.arc(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2, bounds.width / 2, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.clip();
                if (canvasAspect < sourceAspect) {
                    this.drawImageIOSFix(ctx, this.srcImage, 0, 0, this.srcImage.width, this.srcImage.height, this.buffer.width / 2 - w / 2, 0, w, h);
                }
                else {
                    this.drawImageIOSFix(ctx, this.srcImage, 0, 0, this.srcImage.width, this.srcImage.height, 0, this.buffer.height / 2 - h / 2, w, h);
                }
                ctx.restore();
            }
            let marker;
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.markers.length; i++) {
                marker = this.markers[i];
                marker.draw(ctx);
            }
            this.center.draw(ctx);
        }
        else {
            ctx.fillStyle = 'rgba(192,192,192,1)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    dragCenter(x, y, marker) {
        const bounds = this.getBounds();
        const left = x - bounds.width / 2;
        const right = x + bounds.width / 2;
        const top = y - bounds.height / 2;
        const bottom = y + bounds.height / 2;
        if (right >= this.maxXClamp) {
            x = this.maxXClamp - bounds.width / 2;
        }
        if (left <= this.minXClamp) {
            x = bounds.width / 2 + this.minXClamp;
        }
        if (top < this.minYClamp) {
            y = bounds.height / 2 + this.minYClamp;
        }
        if (bottom >= this.maxYClamp) {
            y = this.maxYClamp - bounds.height / 2;
        }
        this.tl.moveX(x - bounds.width / 2);
        this.tl.moveY(y - bounds.height / 2);
        this.tr.moveX(x + bounds.width / 2);
        this.tr.moveY(y - bounds.height / 2);
        this.bl.moveX(x - bounds.width / 2);
        this.bl.moveY(y + bounds.height / 2);
        this.br.moveX(x + bounds.width / 2);
        this.br.moveY(y + bounds.height / 2);
        marker.setPosition(x, y);
    }
    enforceMinSize(x, y, marker) {
        const xLength = x - marker.getHorizontalNeighbour().position.x;
        const yLength = y - marker.getVerticalNeighbour().position.y;
        const xOver = this.minWidth - Math.abs(xLength);
        const yOver = this.minHeight - Math.abs(yLength);
        if (xLength === 0 || yLength === 0) {
            x = marker.position.x;
            y = marker.position.y;
            return new PointPool().instance.borrow(x, y);
        }
        if (this.keepAspect) {
            if (xOver > 0 && yOver / this.aspectRatio > 0) {
                if (xOver > yOver / this.aspectRatio) {
                    if (xLength < 0) {
                        x -= xOver;
                        if (yLength < 0) {
                            y -= xOver * this.aspectRatio;
                        }
                        else {
                            y += xOver * this.aspectRatio;
                        }
                    }
                    else {
                        x += xOver;
                        if (yLength < 0) {
                            y -= xOver * this.aspectRatio;
                        }
                        else {
                            y += xOver * this.aspectRatio;
                        }
                    }
                }
                else {
                    if (yLength < 0) {
                        y -= yOver;
                        if (xLength < 0) {
                            x -= yOver / this.aspectRatio;
                        }
                        else {
                            x += yOver / this.aspectRatio;
                        }
                    }
                    else {
                        y += yOver;
                        if (xLength < 0) {
                            x -= yOver / this.aspectRatio;
                        }
                        else {
                            x += yOver / this.aspectRatio;
                        }
                    }
                }
            }
            else {
                if (xOver > 0) {
                    if (xLength < 0) {
                        x -= xOver;
                        if (yLength < 0) {
                            y -= xOver * this.aspectRatio;
                        }
                        else {
                            y += xOver * this.aspectRatio;
                        }
                    }
                    else {
                        x += xOver;
                        if (yLength < 0) {
                            y -= xOver * this.aspectRatio;
                        }
                        else {
                            y += xOver * this.aspectRatio;
                        }
                    }
                }
                else {
                    if (yOver > 0) {
                        if (yLength < 0) {
                            y -= yOver;
                            if (xLength < 0) {
                                x -= yOver / this.aspectRatio;
                            }
                            else {
                                x += yOver / this.aspectRatio;
                            }
                        }
                        else {
                            y += yOver;
                            if (xLength < 0) {
                                x -= yOver / this.aspectRatio;
                            }
                            else {
                                x += yOver / this.aspectRatio;
                            }
                        }
                    }
                }
            }
        }
        else {
            if (xOver > 0) {
                if (xLength < 0) {
                    x -= xOver;
                }
                else {
                    x += xOver;
                }
            }
            if (yOver > 0) {
                if (yLength < 0) {
                    y -= yOver;
                }
                else {
                    y += yOver;
                }
            }
        }
        if (x < this.minXClamp ||
            x > this.maxXClamp ||
            y < this.minYClamp ||
            y > this.maxYClamp) {
            x = marker.position.x;
            y = marker.position.y;
        }
        return new PointPool().instance.borrow(x, y);
    }
    dragCorner(x, y, marker) {
        let iX = 0;
        let iY = 0;
        let ax = 0;
        let ay = 0;
        let newHeight = 0;
        let newWidth = 0;
        let newY = 0;
        let newX = 0;
        let anchorMarker;
        let fold = 0;
        if (this.keepAspect) {
            anchorMarker = marker.getHorizontalNeighbour().getVerticalNeighbour();
            ax = anchorMarker.position.x;
            ay = anchorMarker.position.y;
            if (x <= anchorMarker.position.x) {
                if (y <= anchorMarker.position.y) {
                    iX = ax - 100 / this.aspectRatio;
                    iY = ay - (100 / this.aspectRatio) * this.aspectRatio;
                    fold = this.getSide(new PointPool().instance.borrow(iX, iY), anchorMarker.position, new PointPool().instance.borrow(x, y));
                    if (fold > 0) {
                        newHeight = Math.abs(anchorMarker.position.y - y);
                        newWidth = newHeight / this.aspectRatio;
                        newY = anchorMarker.position.y - newHeight;
                        newX = anchorMarker.position.x - newWidth;
                        const min = this.enforceMinSize(newX, newY, marker);
                        marker.move(min.x, min.y);
                        new PointPool().instance.returnPoint(min);
                    }
                    else {
                        if (fold < 0) {
                            newWidth = Math.abs(anchorMarker.position.x - x);
                            newHeight = newWidth * this.aspectRatio;
                            newY = anchorMarker.position.y - newHeight;
                            newX = anchorMarker.position.x - newWidth;
                            const min = this.enforceMinSize(newX, newY, marker);
                            marker.move(min.x, min.y);
                            new PointPool().instance.returnPoint(min);
                        }
                    }
                }
                else {
                    iX = ax - 100 / this.aspectRatio;
                    iY = ay + (100 / this.aspectRatio) * this.aspectRatio;
                    fold = this.getSide(new PointPool().instance.borrow(iX, iY), anchorMarker.position, new PointPool().instance.borrow(x, y));
                    if (fold > 0) {
                        newWidth = Math.abs(anchorMarker.position.x - x);
                        newHeight = newWidth * this.aspectRatio;
                        newY = anchorMarker.position.y + newHeight;
                        newX = anchorMarker.position.x - newWidth;
                        const min = this.enforceMinSize(newX, newY, marker);
                        marker.move(min.x, min.y);
                        new PointPool().instance.returnPoint(min);
                    }
                    else {
                        if (fold < 0) {
                            newHeight = Math.abs(anchorMarker.position.y - y);
                            newWidth = newHeight / this.aspectRatio;
                            newY = anchorMarker.position.y + newHeight;
                            newX = anchorMarker.position.x - newWidth;
                            const min = this.enforceMinSize(newX, newY, marker);
                            marker.move(min.x, min.y);
                            new PointPool().instance.returnPoint(min);
                        }
                    }
                }
            }
            else {
                if (y <= anchorMarker.position.y) {
                    iX = ax + 100 / this.aspectRatio;
                    iY = ay - (100 / this.aspectRatio) * this.aspectRatio;
                    fold = this.getSide(new PointPool().instance.borrow(iX, iY), anchorMarker.position, new PointPool().instance.borrow(x, y));
                    if (fold < 0) {
                        newHeight = Math.abs(anchorMarker.position.y - y);
                        newWidth = newHeight / this.aspectRatio;
                        newY = anchorMarker.position.y - newHeight;
                        newX = anchorMarker.position.x + newWidth;
                        const min = this.enforceMinSize(newX, newY, marker);
                        marker.move(min.x, min.y);
                        new PointPool().instance.returnPoint(min);
                    }
                    else {
                        if (fold > 0) {
                            newWidth = Math.abs(anchorMarker.position.x - x);
                            newHeight = newWidth * this.aspectRatio;
                            newY = anchorMarker.position.y - newHeight;
                            newX = anchorMarker.position.x + newWidth;
                            const min = this.enforceMinSize(newX, newY, marker);
                            marker.move(min.x, min.y);
                            new PointPool().instance.returnPoint(min);
                        }
                    }
                }
                else {
                    iX = ax + 100 / this.aspectRatio;
                    iY = ay + (100 / this.aspectRatio) * this.aspectRatio;
                    fold = this.getSide(new PointPool().instance.borrow(iX, iY), anchorMarker.position, new PointPool().instance.borrow(x, y));
                    if (fold < 0) {
                        newWidth = Math.abs(anchorMarker.position.x - x);
                        newHeight = newWidth * this.aspectRatio;
                        newY = anchorMarker.position.y + newHeight;
                        newX = anchorMarker.position.x + newWidth;
                        const min = this.enforceMinSize(newX, newY, marker);
                        marker.move(min.x, min.y);
                        new PointPool().instance.returnPoint(min);
                    }
                    else {
                        if (fold > 0) {
                            newHeight = Math.abs(anchorMarker.position.y - y);
                            newWidth = newHeight / this.aspectRatio;
                            newY = anchorMarker.position.y + newHeight;
                            newX = anchorMarker.position.x + newWidth;
                            const min = this.enforceMinSize(newX, newY, marker);
                            marker.move(min.x, min.y);
                            new PointPool().instance.returnPoint(min);
                        }
                    }
                }
            }
        }
        else {
            const min = this.enforceMinSize(x, y, marker);
            marker.move(min.x, min.y);
            new PointPool().instance.returnPoint(min);
        }
        this.center.recalculatePosition(this.getBounds());
    }
    getSide(a, b, c) {
        const n = this.sign((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x));
        // TODO move the return of the pools to outside of this function
        new PointPool().instance.returnPoint(a);
        new PointPool().instance.returnPoint(c);
        return n;
    }
    handleRelease(newCropTouch) {
        if (newCropTouch == null) {
            return;
        }
        let index = 0;
        for (let k = 0; k < this.currentDragTouches.length; k++) {
            if (newCropTouch.id === this.currentDragTouches[k].id) {
                this.currentDragTouches[k].dragHandle.setDrag(false);
                index = k;
            }
        }
        this.currentDragTouches.splice(index, 1);
        this.draw(this.ctx);
    }
    handleMove(newCropTouch) {
        let matched = false;
        // tslint:disable-next-line:prefer-for-of
        for (let k = 0; k < this.currentDragTouches.length; k++) {
            if (newCropTouch.id === this.currentDragTouches[k].id &&
                this.currentDragTouches[k].dragHandle != null) {
                const dragTouch = this.currentDragTouches[k];
                const clampedPositions = this.clampPosition(newCropTouch.x - dragTouch.dragHandle.offset.x, newCropTouch.y - dragTouch.dragHandle.offset.y);
                newCropTouch.x = clampedPositions.x;
                newCropTouch.y = clampedPositions.y;
                new PointPool().instance.returnPoint(clampedPositions);
                if (dragTouch.dragHandle instanceof CornerMarker) {
                    this.dragCorner(newCropTouch.x, newCropTouch.y, dragTouch.dragHandle);
                }
                else {
                    this.dragCenter(newCropTouch.x, newCropTouch.y, dragTouch.dragHandle);
                }
                this.currentlyInteracting = true;
                matched = true;
                this.imageCropperDataShare.setPressed(this.canvas);
                break;
            }
        }
        if (!matched) {
            for (const marker of this.markers) {
                if (marker.touchInBounds(newCropTouch.x, newCropTouch.y)) {
                    newCropTouch.dragHandle = marker;
                    this.currentDragTouches.push(newCropTouch);
                    marker.setDrag(true);
                    newCropTouch.dragHandle.offset.x =
                        newCropTouch.x - newCropTouch.dragHandle.position.x;
                    newCropTouch.dragHandle.offset.y =
                        newCropTouch.y - newCropTouch.dragHandle.position.y;
                    this.dragCorner(newCropTouch.x - newCropTouch.dragHandle.offset.x, newCropTouch.y - newCropTouch.dragHandle.offset.y, newCropTouch.dragHandle);
                    break;
                }
            }
            if (newCropTouch.dragHandle === null ||
                typeof newCropTouch.dragHandle === 'undefined') {
                if (this.center.touchInBounds(newCropTouch.x, newCropTouch.y)) {
                    newCropTouch.dragHandle = this.center;
                    this.currentDragTouches.push(newCropTouch);
                    newCropTouch.dragHandle.setDrag(true);
                    newCropTouch.dragHandle.offset.x =
                        newCropTouch.x - newCropTouch.dragHandle.position.x;
                    newCropTouch.dragHandle.offset.y =
                        newCropTouch.y - newCropTouch.dragHandle.position.y;
                    this.dragCenter(newCropTouch.x - newCropTouch.dragHandle.offset.x, newCropTouch.y - newCropTouch.dragHandle.offset.y, newCropTouch.dragHandle);
                }
            }
        }
    }
    updateClampBounds() {
        const sourceAspect = this.srcImage.height / this.srcImage.width;
        const canvasAspect = this.canvas.height / this.canvas.width;
        let w = this.canvas.width;
        let h = this.canvas.height;
        if (canvasAspect > sourceAspect) {
            w = this.canvas.width;
            h = this.canvas.width * sourceAspect;
        }
        else {
            h = this.canvas.height;
            w = this.canvas.height / sourceAspect;
        }
        this.minXClamp = this.canvas.width / 2 - w / 2;
        this.minYClamp = this.canvas.height / 2 - h / 2;
        this.maxXClamp = this.canvas.width / 2 + w / 2;
        this.maxYClamp = this.canvas.height / 2 + h / 2;
    }
    getCropBounds() {
        const bounds = this.getBounds();
        bounds.top = Math.round((bounds.top - this.minYClamp) / this.ratioH);
        bounds.bottom = Math.round((bounds.bottom - this.minYClamp) / this.ratioH);
        bounds.left = Math.round((bounds.left - this.minXClamp) / this.ratioW);
        bounds.right = Math.round((bounds.right - this.minXClamp) / this.ratioW);
        return bounds;
    }
    clampPosition(x, y) {
        if (x < this.minXClamp) {
            x = this.minXClamp;
        }
        if (x > this.maxXClamp) {
            x = this.maxXClamp;
        }
        if (y < this.minYClamp) {
            y = this.minYClamp;
        }
        if (y > this.maxYClamp) {
            y = this.maxYClamp;
        }
        return new PointPool().instance.borrow(x, y);
    }
    isImageSet() {
        return this.imageSet;
    }
    setImage(img) {
        this.srcImage = img;
        if (!img) {
            this.imageSet = false;
            this.draw(this.ctx);
        }
        else {
            this.imageSet = true;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            const bufferContext = this.buffer.getContext('2d');
            bufferContext.clearRect(0, 0, this.buffer.width, this.buffer.height);
            if (!this.cropperSettings.fileType) {
                this.fileType = this.getDataUriMimeType(img.src);
            }
            if (this.cropperSettings.minWithRelativeToResolution) {
                this.minWidth =
                    (this.canvas.width * this.cropperSettings.minWidth) /
                        this.srcImage.width;
                this.minHeight =
                    (this.canvas.height * this.cropperSettings.minHeight) /
                        this.srcImage.height;
            }
            this.updateClampBounds();
            this.canvasWidth = this.canvas.width;
            this.canvasHeight = this.canvas.height;
            const cropPosition = this.getCropPositionFromMarkers();
            this.setCropPosition(cropPosition);
        }
    }
    updateCropPosition(cropBounds) {
        const cropPosition = this.getCropPositionFromBounds(cropBounds);
        this.setCropPosition(cropPosition);
    }
    setCropPosition(cropPosition) {
        this.tl.setPosition(cropPosition[0].x, cropPosition[0].y);
        this.tr.setPosition(cropPosition[1].x, cropPosition[1].y);
        this.bl.setPosition(cropPosition[2].x, cropPosition[2].y);
        this.br.setPosition(cropPosition[3].x, cropPosition[3].y);
        this.center.setPosition(cropPosition[4].x, cropPosition[4].y);
        for (const position of cropPosition) {
            new PointPool().instance.returnPoint(position);
        }
        this.vertSquashRatio = this.detectVerticalSquash(this.srcImage);
        this.draw(this.ctx);
        this.croppedImage = this.getCroppedImageHelper(false, this.cropWidth, this.cropHeight);
    }
    getCropPositionFromMarkers() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        let tlPos;
        let trPos;
        let blPos;
        let brPos;
        let center;
        const sourceAspect = this.srcImage.height / this.srcImage.width;
        const cropBounds = this.getBounds();
        const cropAspect = cropBounds.height / cropBounds.width;
        const cX = this.canvas.width / 2;
        const cY = this.canvas.height / 2;
        if (cropAspect > sourceAspect) {
            const imageH = Math.min(w * sourceAspect, h);
            const cropW = (this.cropperSettings.showFullCropInitial) ? Math.min(h / sourceAspect, w) : imageH / cropAspect;
            tlPos = new PointPool().instance.borrow(cX - cropW / 2, cY + imageH / 2);
            trPos = new PointPool().instance.borrow(cX + cropW / 2, cY + imageH / 2);
            blPos = new PointPool().instance.borrow(cX - cropW / 2, cY - imageH / 2);
            brPos = new PointPool().instance.borrow(cX + cropW / 2, cY - imageH / 2);
        }
        else {
            const imageW = Math.min(h / sourceAspect, w);
            const cropH = (this.cropperSettings.showFullCropInitial) ? Math.min(w * sourceAspect, h) : imageW * cropAspect;
            tlPos = new PointPool().instance.borrow(cX - imageW / 2, cY + cropH / 2);
            trPos = new PointPool().instance.borrow(cX + imageW / 2, cY + cropH / 2);
            blPos = new PointPool().instance.borrow(cX - imageW / 2, cY - cropH / 2);
            brPos = new PointPool().instance.borrow(cX + imageW / 2, cY - cropH / 2);
        }
        center = new PointPool().instance.borrow(cX, cY);
        const positions = [tlPos, trPos, blPos, brPos, center];
        return positions;
    }
    getCropPositionFromBounds(cropPosition) {
        let marginTop = 0;
        let marginLeft = 0;
        const canvasAspect = this.canvasHeight / this.canvasWidth;
        const sourceAspect = this.srcImage.height / this.srcImage.width;
        if (canvasAspect > sourceAspect) {
            marginTop =
                this.buffer.height / 2 - (this.canvasWidth * sourceAspect) / 2;
        }
        else {
            marginLeft = this.buffer.width / 2 - this.canvasHeight / sourceAspect / 2;
        }
        const ratioW = (this.canvasWidth - marginLeft * 2) / this.srcImage.width;
        const ratioH = (this.canvasHeight - marginTop * 2) / this.srcImage.height;
        let actualH = cropPosition.height * ratioH;
        let actualW = cropPosition.width * ratioW;
        const actualX = cropPosition.left * ratioW + marginLeft;
        const actualY = cropPosition.top * ratioH + marginTop;
        if (this.keepAspect) {
            const scaledW = actualH / this.aspectRatio;
            const scaledH = actualW * this.aspectRatio;
            if (this.getCropBounds().height === cropPosition.height) {
                // only width changed
                actualH = scaledH;
            }
            else if (this.getCropBounds().width === cropPosition.width) {
                // only height changed
                actualW = scaledW;
            }
            else {
                // height and width changed
                if (Math.abs(scaledH - actualH) < Math.abs(scaledW - actualW)) {
                    actualW = scaledW;
                }
                else {
                    actualH = scaledH;
                }
            }
        }
        const tlPos = new PointPool().instance.borrow(actualX, actualY + actualH);
        const trPos = new PointPool().instance.borrow(actualX + actualW, actualY + actualH);
        const blPos = new PointPool().instance.borrow(actualX, actualY);
        const brPos = new PointPool().instance.borrow(actualX + actualW, actualY);
        const center = new PointPool().instance.borrow(actualX + actualW / 2, actualY + actualH / 2);
        const positions = [tlPos, trPos, blPos, brPos, center];
        return positions;
    }
    getCroppedImageHelper(preserveSize, fillWidth, fillHeight) {
        if (this.cropperSettings.cropOnResize) {
            return this.getCroppedImage(preserveSize, fillWidth, fillHeight);
        }
        return this.croppedImage
            ? this.croppedImage
            : document.createElement('img');
    }
    // todo: Unused parameters?
    getCroppedImage(preserveSize, fillWidth, fillHeight) {
        const bounds = this.getBounds();
        if (!this.srcImage) {
            return document.createElement('img');
        }
        else {
            const sourceAspect = this.srcImage.height / this.srcImage.width;
            const canvasAspect = this.canvas.height / this.canvas.width;
            let w = this.canvas.width;
            let h = this.canvas.height;
            if (canvasAspect > sourceAspect) {
                w = this.canvas.width;
                h = this.canvas.width * sourceAspect;
            }
            else {
                if (canvasAspect < sourceAspect) {
                    h = this.canvas.height;
                    w = this.canvas.height / sourceAspect;
                }
                else {
                    h = this.canvas.height;
                    w = this.canvas.width;
                }
            }
            this.ratioW = w / this.srcImage.width;
            this.ratioH = h / this.srcImage.height;
            const offsetH = (this.buffer.height - h) / 2 / this.ratioH;
            const offsetW = (this.buffer.width - w) / 2 / this.ratioW;
            const ctx = this.cropCanvas.getContext('2d');
            if (this.cropperSettings.preserveSize || preserveSize) {
                const width = Math.round(bounds.right / this.ratioW - bounds.left / this.ratioW);
                const height = Math.round(bounds.bottom / this.ratioH - bounds.top / this.ratioH);
                this.cropCanvas.width = width;
                this.cropCanvas.height = height;
                this.cropperSettings.croppedWidth = this.cropCanvas.width;
                this.cropperSettings.croppedHeight = this.cropCanvas.height;
            }
            else {
                this.cropCanvas.width = this.cropWidth;
                this.cropCanvas.height = this.cropHeight;
            }
            ctx.clearRect(0, 0, this.cropCanvas.width, this.cropCanvas.height);
            this.drawImageIOSFix(ctx, this.srcImage, Math.max(Math.round(bounds.left / this.ratioW - offsetW), 0), Math.max(Math.round(bounds.top / this.ratioH - offsetH), 0), Math.max(Math.round(bounds.width / this.ratioW), 1), Math.max(Math.round(bounds.height / this.ratioH), 1), 0, 0, this.cropCanvas.width, this.cropCanvas.height);
            if (this.cropperSettings.resampleFn) {
                this.cropperSettings.resampleFn(this.cropCanvas);
            }
            this.croppedImage.width = this.cropCanvas.width;
            this.croppedImage.height = this.cropCanvas.height;
            this.croppedImage.src = this.cropCanvas.toDataURL(this.fileType, this.cropperSettings.compressRatio);
            return this.croppedImage;
        }
    }
    getBounds() {
        let minX = Number.MAX_VALUE;
        let minY = Number.MAX_VALUE;
        let maxX = -Number.MAX_VALUE;
        let maxY = -Number.MAX_VALUE;
        for (const marker of this.markers) {
            if (marker.position.x < minX) {
                minX = marker.position.x;
            }
            if (marker.position.x > maxX) {
                maxX = marker.position.x;
            }
            if (marker.position.y < minY) {
                minY = marker.position.y;
            }
            if (marker.position.y > maxY) {
                maxY = marker.position.y;
            }
        }
        const bounds = new Bounds();
        bounds.left = minX;
        bounds.right = maxX;
        bounds.top = minY;
        bounds.bottom = maxY;
        return bounds;
    }
    setBounds(bounds) {
        // const topLeft: CornerMarker;
        // const topRight: CornerMarker;
        // const bottomLeft: CornerMarker;
        // const bottomRight: CornerMarker;
        const currentBounds = this.getBounds();
        for (const marker of this.markers) {
            if (marker.position.x === currentBounds.left) {
                if (marker.position.y === currentBounds.top) {
                    marker.setPosition(bounds.left, bounds.top);
                }
                else {
                    marker.setPosition(bounds.left, bounds.bottom);
                }
            }
            else {
                if (marker.position.y === currentBounds.top) {
                    marker.setPosition(bounds.right, bounds.top);
                }
                else {
                    marker.setPosition(bounds.right, bounds.bottom);
                }
            }
        }
        this.center.recalculatePosition(bounds);
        this.center.draw(this.ctx);
        this.draw(this.ctx); // we need to redraw all canvas if we have changed bounds
    }
    onTouchMove(event) {
        if (this.crop.isImageSet()) {
            if (event.touches.length === 1) {
                if (this.isMouseDown) {
                    event.preventDefault();
                    // tslint:disable-next-line:prefer-for-of
                    for (let i = 0; i < event.touches.length; i++) {
                        const touch = event.touches[i];
                        const touchPosition = this.getTouchPos(this.canvas, touch);
                        const cropTouch = new CropTouch(touchPosition.x, touchPosition.y, touch.identifier);
                        new PointPool().instance.returnPoint(touchPosition);
                        this.move(cropTouch);
                    }
                }
            }
            else {
                if (event.touches.length === 2) {
                    event.preventDefault();
                    const distance = (event.touches[0].clientX - event.touches[1].clientX) *
                        (event.touches[0].clientX - event.touches[1].clientX) +
                        (event.touches[0].clientY - event.touches[1].clientY) *
                            (event.touches[0].clientY - event.touches[1].clientY);
                    if (this.previousDistance && this.previousDistance !== distance) {
                        const bounds = this.getBounds();
                        if (distance < this.previousDistance) {
                            bounds.top += 1;
                            bounds.left += 1;
                            bounds.right -= 1;
                            bounds.bottom -= 1;
                        }
                        if (distance > this.previousDistance) {
                            if (bounds.top !== this.minYClamp &&
                                bounds.bottom !== this.maxYClamp &&
                                bounds.left !== this.minXClamp &&
                                bounds.right !== this.maxXClamp) {
                                // none
                                bounds.top -= 1;
                                bounds.left -= 1;
                                bounds.right += 1;
                                bounds.bottom += 1;
                            }
                            else if (bounds.top !== this.minYClamp &&
                                bounds.bottom !== this.maxYClamp &&
                                bounds.left === this.minXClamp &&
                                bounds.right !== this.maxXClamp) {
                                // left
                                bounds.top -= 1;
                                bounds.right += 2;
                                bounds.bottom += 1;
                            }
                            else if (bounds.top !== this.minYClamp &&
                                bounds.bottom !== this.maxYClamp &&
                                bounds.left !== this.minXClamp &&
                                bounds.right === this.maxXClamp) {
                                // right
                                bounds.top -= 1;
                                bounds.left -= 2;
                                bounds.bottom += 1;
                            }
                            else if (bounds.top === this.minYClamp &&
                                bounds.bottom !== this.maxYClamp &&
                                bounds.left !== this.minXClamp &&
                                bounds.right !== this.maxXClamp) {
                                // top
                                bounds.left -= 1;
                                bounds.right += 1;
                                bounds.bottom += 2;
                            }
                            else if (bounds.top !== this.minYClamp &&
                                bounds.bottom === this.maxYClamp &&
                                bounds.left !== this.minXClamp &&
                                bounds.right !== this.maxXClamp) {
                                // bottom
                                bounds.top -= 2;
                                bounds.left -= 1;
                                bounds.right += 1;
                            }
                            else if (bounds.top === this.minYClamp &&
                                bounds.bottom !== this.maxYClamp &&
                                bounds.left === this.minXClamp &&
                                bounds.right !== this.maxXClamp) {
                                // top left
                                bounds.right += 2;
                                bounds.bottom += 2;
                            }
                            else if (bounds.top === this.minYClamp &&
                                bounds.bottom !== this.maxYClamp &&
                                bounds.left !== this.minXClamp &&
                                bounds.right === this.maxXClamp) {
                                // top right
                                bounds.left -= 2;
                                bounds.bottom += 2;
                            }
                            else if (bounds.top !== this.minYClamp &&
                                bounds.bottom === this.maxYClamp &&
                                bounds.left === this.minXClamp &&
                                bounds.right !== this.maxXClamp) {
                                // bottom left
                                bounds.top -= 2;
                                bounds.right += 2;
                            }
                            else if (bounds.top !== this.minYClamp &&
                                bounds.bottom === this.maxYClamp &&
                                bounds.left !== this.minXClamp &&
                                bounds.right === this.maxXClamp) {
                                // bottom right
                                bounds.top -= 2;
                                bounds.left -= 2;
                            }
                        }
                        if (bounds.top < this.minYClamp) {
                            bounds.top = this.minYClamp;
                        }
                        if (bounds.bottom > this.maxYClamp) {
                            bounds.bottom = this.maxYClamp;
                        }
                        if (bounds.left < this.minXClamp) {
                            bounds.left = this.minXClamp;
                        }
                        if (bounds.right > this.maxXClamp) {
                            bounds.right = this.maxXClamp;
                        }
                        this.setBounds(bounds);
                    }
                    this.previousDistance = distance;
                }
            }
            this.draw(this.ctx);
        }
    }
    onMouseMove(e) {
        if (this.crop.isImageSet() && this.isMouseDown) {
            const mousePosition = this.getMousePos(this.canvas, e);
            this.move(new CropTouch(mousePosition.x, mousePosition.y, 0));
            let dragTouch = this.getDragTouchForID(0);
            if (dragTouch) {
                dragTouch.x = mousePosition.x;
                dragTouch.y = mousePosition.y;
            }
            else {
                dragTouch = new CropTouch(mousePosition.x, mousePosition.y, 0);
            }
            new PointPool().instance.returnPoint(mousePosition);
            this.drawCursors(dragTouch);
            this.draw(this.ctx);
        }
    }
    move(cropTouch) {
        if (this.isMouseDown) {
            this.handleMove(cropTouch);
        }
    }
    getDragTouchForID(id) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.currentDragTouches.length; i++) {
            if (id === this.currentDragTouches[i].id) {
                return this.currentDragTouches[i];
            }
        }
        return undefined;
    }
    drawCursors(cropTouch) {
        let cursorDrawn = false;
        if (cropTouch != null) {
            if (cropTouch.dragHandle === this.center) {
                this.imageCropperDataShare.setStyle(this.canvas, 'move');
                cursorDrawn = true;
            }
            if (cropTouch.dragHandle !== null &&
                cropTouch.dragHandle instanceof CornerMarker) {
                this.drawCornerCursor(cropTouch.dragHandle, cropTouch.dragHandle.position.x, cropTouch.dragHandle.position.y);
                cursorDrawn = true;
            }
        }
        let didDraw = false;
        if (!cursorDrawn) {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.markers.length; i++) {
                didDraw =
                    didDraw ||
                        this.drawCornerCursor(this.markers[i], cropTouch.x, cropTouch.y);
            }
            if (!didDraw) {
                this.imageCropperDataShare.setStyle(this.canvas, 'initial');
            }
        }
        if (!didDraw &&
            !cursorDrawn &&
            this.center.touchInBounds(cropTouch.x, cropTouch.y)) {
            this.center.setOver(true);
            this.imageCropperDataShare.setOver(this.canvas);
            this.imageCropperDataShare.setStyle(this.canvas, 'move');
        }
        else {
            this.center.setOver(false);
        }
    }
    drawCornerCursor(marker, x, y) {
        if (marker.touchInBounds(x, y)) {
            marker.setOver(true);
            if (marker.getHorizontalNeighbour().position.x > marker.position.x) {
                if (marker.getVerticalNeighbour().position.y > marker.position.y) {
                    this.imageCropperDataShare.setOver(this.canvas);
                    this.imageCropperDataShare.setStyle(this.canvas, 'nwse-resize');
                }
                else {
                    this.imageCropperDataShare.setOver(this.canvas);
                    this.imageCropperDataShare.setStyle(this.canvas, 'nesw-resize');
                }
            }
            else {
                if (marker.getVerticalNeighbour().position.y > marker.position.y) {
                    this.imageCropperDataShare.setOver(this.canvas);
                    this.imageCropperDataShare.setStyle(this.canvas, 'nesw-resize');
                }
                else {
                    this.imageCropperDataShare.setOver(this.canvas);
                    this.imageCropperDataShare.setStyle(this.canvas, 'nwse-resize');
                }
            }
            return true;
        }
        marker.setOver(false);
        return false;
    }
    onTouchStart(event) {
        if (this.crop.isImageSet()) {
            const touch = event.touches[0];
            const touchPosition = this.getTouchPos(this.canvas, touch);
            const cropTouch = new CropTouch(touchPosition.x, touchPosition.y, touch.identifier);
            new PointPool().instance.returnPoint(touchPosition);
            this.isMouseDown = false;
            for (const marker of this.markers) {
                if (marker.touchInBounds(cropTouch.x, cropTouch.y)) {
                    this.isMouseDown = true;
                }
            }
            if (this.center.touchInBounds(cropTouch.x, cropTouch.y)) {
                this.isMouseDown = true;
            }
        }
    }
    onTouchEnd(event) {
        if (this.crop.isImageSet()) {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < event.changedTouches.length; i++) {
                const touch = event.changedTouches[i];
                const dragTouch = this.getDragTouchForID(touch.identifier);
                if (dragTouch && dragTouch !== undefined) {
                    if (dragTouch.dragHandle instanceof CornerMarker ||
                        dragTouch.dragHandle instanceof DragMarker) {
                        dragTouch.dragHandle.setOver(false);
                    }
                    this.handleRelease(dragTouch);
                }
            }
            if (this.currentDragTouches.length === 0) {
                this.isMouseDown = false;
                this.currentlyInteracting = false;
            }
        }
    }
    // http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
    drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
        // Works only if whole image is displayed:
        // ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
        // The following works correct also when only a part of the image is displayed:
        // ctx.drawImage(img, sx * this.vertSquashRatio, sy * this.vertSquashRatio, sw * this.vertSquashRatio, sh *
        // this.vertSquashRatio, dx, dy, dw, dh);
        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
    }
    onMouseDown(event) {
        if (this.crop.isImageSet()) {
            this.isMouseDown = true;
        }
    }
    onMouseUp(event) {
        if (this.crop.isImageSet()) {
            this.imageCropperDataShare.setReleased(this.canvas);
            this.isMouseDown = false;
            this.handleRelease(new CropTouch(0, 0, 0));
        }
    }
}

class CropPosition {
    constructor(x = 0, y = 0, w = 0, h = 0) {
        this.x = +x;
        this.y = +y;
        this.w = +w;
        this.h = +h;
    }
    toBounds() {
        return new Bounds(this.x, this.y, this.w, this.h);
    }
    isInitialized() {
        return this.x !== 0 && this.y !== 0 && this.w !== 0 && this.h !== 0;
    }
}

class ImageCropperComponent {
    constructor(renderer, document) {
        this.document = document;
        this.cropPositionChange = new EventEmitter();
        this.exif = new Exif();
        // tslint:disable-next-line:no-output-on-prefix
        this.onCrop = new EventEmitter();
        this.imageSet = new EventEmitter();
        this.dragUnsubscribers = [];
        this.renderer = renderer;
    }
    ngAfterViewInit() {
        const canvas = this.cropcanvas.nativeElement;
        if (!this.settings) {
            this.settings = new CropperSettings();
        }
        if (this.settings.cropperClass) {
            this.renderer.setAttribute(canvas, 'class', this.settings.cropperClass);
        }
        if (!this.settings.dynamicSizing) {
            this.renderer.setAttribute(canvas, 'width', this.settings.canvasWidth.toString());
            this.renderer.setAttribute(canvas, 'height', this.settings.canvasHeight.toString());
        }
        else {
            this.windowListener = this.resize.bind(this);
            window.addEventListener('resize', this.windowListener);
        }
        if (!this.cropper) {
            this.cropper = new ImageCropper(this.settings);
        }
        this.cropper.prepare(canvas);
    }
    ngOnChanges(changes) {
        if (this.isCropPositionChanged(changes)) {
            this.cropper.updateCropPosition(this.cropPosition.toBounds());
            if (this.cropper.isImageSet()) {
                const bounds = this.cropper.getCropBounds();
                this.image.image = this.cropper.getCroppedImageHelper().src;
                this.onCrop.emit(bounds);
            }
            this.updateCropBounds();
        }
        if (changes.inputImage) {
            this.setImage(changes.inputImage.currentValue);
        }
        if (changes.settings && this.cropper) {
            this.cropper.updateSettings(this.settings);
            if (this.cropper.isImageSet()) {
                this.image.image = this.cropper.getCroppedImageHelper().src;
                this.onCrop.emit(this.cropper.getCropBounds());
            }
        }
    }
    ngOnDestroy() {
        this.removeDragListeners();
        if (this.settings.dynamicSizing && this.windowListener) {
            window.removeEventListener('resize', this.windowListener);
        }
    }
    onTouchMove(event) {
        this.cropper.onTouchMove(event);
    }
    onTouchStart(event) {
        this.cropper.onTouchStart(event);
    }
    onTouchEnd(event) {
        this.cropper.onTouchEnd(event);
        if (this.cropper.isImageSet()) {
            this.image.image = this.cropper.getCroppedImageHelper().src;
            this.onCrop.emit(this.cropper.getCropBounds());
            this.updateCropBounds();
        }
    }
    onMouseDown(event) {
        this.dragUnsubscribers.push(this.renderer.listen(this.document, 'mousemove', this.onMouseMove.bind(this)));
        this.dragUnsubscribers.push(this.renderer.listen(this.document, 'mouseup', this.onMouseUp.bind(this)));
        this.cropper.onMouseDown(event);
        // if (!this.cropper.isImageSet() && !this.settings.noFileInput) {
        //   // load img
        //   this.fileInput.nativeElement.click();
        // }
    }
    removeDragListeners() {
        this.dragUnsubscribers.forEach(unsubscribe => unsubscribe());
    }
    onMouseUp(event) {
        this.removeDragListeners();
        if (this.cropper.isImageSet()) {
            this.cropper.onMouseUp(event);
            this.image.image = this.cropper.getCroppedImageHelper().src;
            this.onCrop.emit(this.cropper.getCropBounds());
            this.updateCropBounds();
        }
    }
    onMouseMove(event) {
        this.cropper.onMouseMove(event);
    }
    fileChangeListener($event) {
        if ($event.target.files.length === 0) {
            return;
        }
        const file = $event.target.files[0];
        if (this.settings.allowedFilesRegex.test(file.name)) {
            const image = new Image();
            const fileReader = new FileReader();
            fileReader.addEventListener('loadend', (loadEvent) => {
                image.addEventListener('load', () => {
                    this.setImage(image);
                });
                image.src = loadEvent.target.result;
            });
            fileReader.readAsDataURL(file);
        }
    }
    resize() {
        const canvas = this.cropcanvas.nativeElement;
        this.settings.canvasWidth = canvas.offsetWidth;
        this.settings.canvasHeight = canvas.offsetHeight;
        this.cropper.resizeCanvas(canvas.offsetWidth, canvas.offsetHeight, true);
    }
    reset() {
        this.cropper.reset();
        this.renderer.setAttribute(this.cropcanvas.nativeElement, 'class', this.settings.cropperClass);
        this.image.image = this.cropper.getCroppedImageHelper().src;
    }
    setImage(image, newBounds = null) {
        this.imageSet.emit(true);
        this.renderer.setAttribute(this.cropcanvas.nativeElement, 'class', `${this.settings.cropperClass} ${this.settings.croppingClass}`);
        this.raf = window.requestAnimationFrame(() => {
            if (this.raf) {
                window.cancelAnimationFrame(this.raf);
            }
            if (image.naturalHeight > 0 && image.naturalWidth > 0) {
                image.height = image.naturalHeight;
                image.width = image.naturalWidth;
                window.cancelAnimationFrame(this.raf);
                this.getOrientedImage(image, (img) => {
                    if (this.settings.dynamicSizing) {
                        const canvas = this.cropcanvas.nativeElement;
                        this.settings.canvasWidth = canvas.offsetWidth;
                        this.settings.canvasHeight = canvas.offsetHeight;
                        this.cropper.resizeCanvas(canvas.offsetWidth, canvas.offsetHeight, false);
                    }
                    this.cropper.setImage(img);
                    if (this.cropPosition && this.cropPosition.isInitialized()) {
                        this.cropper.updateCropPosition(this.cropPosition.toBounds());
                    }
                    this.image.original = img;
                    let bounds = this.cropper.getCropBounds();
                    this.image.image = this.cropper.getCroppedImageHelper().src;
                    if (!this.image) {
                        this.image = image;
                    }
                    if (newBounds != null) {
                        bounds = newBounds;
                        this.cropper.setBounds(bounds);
                        this.cropper.updateCropPosition(bounds);
                    }
                    this.onCrop.emit(bounds);
                });
            }
        });
    }
    isCropPositionChanged(changes) {
        if (this.cropper &&
            changes.cropPosition &&
            this.isCropPositionUpdateNeeded) {
            return true;
        }
        else {
            this.isCropPositionUpdateNeeded = true;
            return false;
        }
    }
    updateCropBounds() {
        const cropBound = this.cropper.getCropBounds();
        this.cropPositionChange.emit(new CropPosition(cropBound.left, cropBound.top, cropBound.width, cropBound.height));
        this.isCropPositionUpdateNeeded = false;
    }
    getOrientedImage(image, callback) {
        let img;
        this.exif.getData(image, () => {
            const orientation = this.exif.getTag(image, 'Orientation');
            if ([3, 6, 8].indexOf(orientation) > -1) {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                let cw = image.width;
                let ch = image.height;
                let cx = 0;
                let cy = 0;
                let deg = 0;
                switch (orientation) {
                    case 3:
                        cx = -image.width;
                        cy = -image.height;
                        deg = 180;
                        break;
                    case 6:
                        cw = image.height;
                        ch = image.width;
                        cy = -image.height;
                        deg = 90;
                        break;
                    case 8:
                        cw = image.height;
                        ch = image.width;
                        cx = -image.width;
                        deg = 270;
                        break;
                    default:
                        break;
                }
                canvas.width = cw;
                canvas.height = ch;
                ctx.rotate((deg * Math.PI) / 180);
                ctx.drawImage(image, cx, cy);
                img = document.createElement('img');
                img.width = cw;
                img.height = ch;
                img.addEventListener('load', () => {
                    callback(img);
                });
                img.src = canvas.toDataURL('image/png');
            }
            else {
                img = image;
                callback(img);
            }
        });
    }
}
ImageCropperComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.8", ngImport: i0, type: ImageCropperComponent, deps: [{ token: i0.Renderer2 }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Component });
ImageCropperComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.8", type: ImageCropperComponent, selector: "img-cropper", inputs: { settings: "settings", image: "image", inputImage: "inputImage", cropper: "cropper", cropPosition: "cropPosition" }, outputs: { cropPositionChange: "cropPositionChange", onCrop: "onCrop", imageSet: "imageSet" }, viewQueries: [{ propertyName: "cropcanvas", first: true, predicate: ["cropcanvas"], descendants: true, static: true }, { propertyName: "fileInput", first: true, predicate: ["fileInput"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "<span class=\"ng2-imgcrop\">\n  <input\n    *ngIf=\"!settings.noFileInput\"\n    #fileInput\n    type=\"file\"\n    accept=\"image/*\"\n    (change)=\"fileChangeListener($event)\"\n  />\n  <canvas\n    #cropcanvas\n    (mousedown)=\"onMouseDown($event)\"\n    (touchmove)=\"onTouchMove($event)\"\n    (touchend)=\"onTouchEnd($event)\"\n    (touchstart)=\"onTouchStart($event)\"\n  >\n  </canvas>\n</span>\n", dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.8", ngImport: i0, type: ImageCropperComponent, decorators: [{
            type: Component,
            args: [{ selector: 'img-cropper', template: "<span class=\"ng2-imgcrop\">\n  <input\n    *ngIf=\"!settings.noFileInput\"\n    #fileInput\n    type=\"file\"\n    accept=\"image/*\"\n    (change)=\"fileChangeListener($event)\"\n  />\n  <canvas\n    #cropcanvas\n    (mousedown)=\"onMouseDown($event)\"\n    (touchmove)=\"onTouchMove($event)\"\n    (touchend)=\"onTouchEnd($event)\"\n    (touchstart)=\"onTouchStart($event)\"\n  >\n  </canvas>\n</span>\n" }]
        }], ctorParameters: function () {
        return [{ type: i0.Renderer2 }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [DOCUMENT]
                    }] }];
    }, propDecorators: { cropcanvas: [{
                type: ViewChild,
                args: ['cropcanvas', { static: true }]
            }], fileInput: [{
                type: ViewChild,
                args: ['fileInput']
            }], settings: [{
                type: Input
            }], image: [{
                type: Input
            }], inputImage: [{
                type: Input
            }], cropper: [{
                type: Input
            }], cropPosition: [{
                type: Input
            }], cropPositionChange: [{
                type: Output
            }], onCrop: [{
                type: Output
            }], imageSet: [{
                type: Output
            }] } });

class ImageCropperModule {
}
ImageCropperModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.8", ngImport: i0, type: ImageCropperModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ImageCropperModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.8", ngImport: i0, type: ImageCropperModule, declarations: [ImageCropperComponent], imports: [CommonModule], exports: [ImageCropperComponent] });
ImageCropperModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.8", ngImport: i0, type: ImageCropperModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.8", ngImport: i0, type: ImageCropperModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ImageCropperComponent],
                    exports: [ImageCropperComponent],
                    imports: [CommonModule]
                }]
        }] });

class ImageCropperService {
    constructor() { }
}
ImageCropperService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.8", ngImport: i0, type: ImageCropperService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ImageCropperService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.8", ngImport: i0, type: ImageCropperService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.8", ngImport: i0, type: ImageCropperService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

// looks like this CropService is never used
class CropService {
    init(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
    }
}

/*
 * Public API Surface of ngx-img-cropper
 */

/**
 * Generated bundle index. Do not edit.
 */

export { Bounds, CornerMarker, CropPosition, CropService, CropTouch, CropperDrawSettings, CropperSettings, DragMarker, Exif, Fraction, Handle, ImageCropper, ImageCropperComponent, ImageCropperDataShare, ImageCropperModel, ImageCropperModule, ImageCropperService, Point, PointPool };
//# sourceMappingURL=ngx-img-cropper.mjs.map
