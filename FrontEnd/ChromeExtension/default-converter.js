import { deserialize, getPropertyName, normalize, indent as indentUtil } from './util.js';

let arrayTypeIndex = 0;
let stringBuilder = '';

export default function objectInitializerUtil(jStr, rootName = 'Root') {
    stringBuilder = '';
    let jObj = deserialize(jStr);
    constructObject(jObj, 0, rootName, true);
    return stringBuilder;
}

function constructObject(jObj, level, propertyName, isLast = false, isNewLine = true, previousType = 'string') {
    let objectType = typeof jObj;
    if (objectType == 'object' && jObj != null && !jObj.length) {
        indent(level, isNewLine);
        stringBuilder += 'new ' + propertyName + '\n';
        indent(level);
        stringBuilder += '{\n';
        let keys = Object.getOwnPropertyNames(jObj);
        keys.forEach((key, index, _keys) => {
            let child = jObj[key];

            let childType = typeof child;
            indent(level + 1, true);
            var normalizedPropertyName = normalize(getPropertyName(key));
            stringBuilder += normalizedPropertyName;
            stringBuilder += ' = ';

            let isLastChild = keys.length - 1 == index;
            constructObject(child, level + 1, normalizedPropertyName, isLastChild, false);

            if (!isLastChild && (child == null || childType != 'object')) {
                stringBuilder += ',\n';
            }
        });

        stringBuilder += '\n';
        indent(level);
        stringBuilder += '}';
        if (!isLast) {
            stringBuilder += ',\n';
        }
    } else if (objectType == 'object' && jObj != null && jObj.length) {
        indent(level, isNewLine);
        if (previousType == 'array') {
            propertyName = propertyName + arrayTypeIndex;
            arrayTypeIndex++;
        }

        stringBuilder += 'new List<' + propertyName + '>\n';
        indent(level);
        stringBuilder += '{\n';
        jObj.forEach((child, index, _jObj) => {
            let childType = typeof child;
            let isLastChild = jObj.length - 1 == index;
            constructObject(child, level + 1, propertyName, isLastChild, true, 'array');
            if (!isLastChild && (childType != 'object')) {
                stringBuilder += ',\n';
            }
        });

        stringBuilder += '\n';
        indent(level);
        stringBuilder += '}';
        if (!isLast) {
            stringBuilder += ',\n';
        }
    } else if (objectType == 'string') {
        indent(level, isNewLine);
        var stringLiteral = `"${jObj}"`;
        stringBuilder += stringLiteral;
    } else if (objectType == 'number' || objectType == 'boolean' || jObj == null) {
        indent(level, isNewLine);
        stringBuilder += jObj;
    } else {
        throw "Invalid element type.";
    }
}

function indent(tabIndentCount, isNewLine = true) {
    stringBuilder += indentUtil(tabIndentCount, isNewLine);
}
