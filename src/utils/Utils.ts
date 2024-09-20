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
