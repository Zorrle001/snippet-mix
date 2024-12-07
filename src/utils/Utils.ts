export function cn(...classes: string[]) {
    return classes.join(" ");
}

export function removeItemAll(arr: any[], value: any) {
    var i = 0;
    while (i < arr.length) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
    return arr;
}

export function removeItemOnce(arr: Object[], value: any) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

export function splitArrayIntoChunks(arr: any[], chunkSize: number): any[][] {
    let result = [];

    for (let i = 0; i < arr.length; i += chunkSize) {
        let chunk = arr.slice(i, i + chunkSize);
        result.push(chunk);
    }

    return result;
}
