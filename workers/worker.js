var mergeSort = (function () {
    function merger(array, start, end) {
        if (Math.abs(end - start) <= 1) {
            return [];
        }
        var middle = Math.ceil((start + end) / 2);

        merger(array, start, middle);
        merger(array, middle, end);

        return merge(array, start, middle, end);
    }

    function merge(array, start, middle, end) {
        var left = [],
            right = [],
            leftSize = middle - start,
            rightSize = end - middle,
            maxSize = Math.max(leftSize, rightSize),
            size = end - start,
            i;

        for (i = 0; i < maxSize; i += 1) {
            if (i < leftSize) {
                left[i] = array[start + i];
            }
            if (i < rightSize) {
                right[i] = array[middle + i];
            }
        }
        i = 0;
        while (i < size) {
            if (left.length && right.length) {
                if (left[0] >= right[0]) {
                    array[start + i] = right.shift();
                } else {
                    array[start + i] = left.shift();
                }
            } else if (left.length) {
                array[start + i] = left.shift();
            } else {
                array[start + i] = right.shift();
            }
            i += 1;
        }
        return array;
    }
    return function (array) {
        return merger(array, 0, array.length);
    };
}());

var generateArray = function (uIntAray) {
    var i;
    for (i = 0; i < uIntAray.length; ++i) {
        uIntAray[i] = Math.floor(Math.random() * 1000);
    }
};

self.addEventListener('message', function(e) {
    var data = e.data,
        uInt8Array;

    switch (data.command) {
        case 'generate':
            console.log('generating array');
            uInt8Array = new Uint8Array(new ArrayBuffer(data.length));
            generateArray(uInt8Array);
            self.postMessage({result: 'generated', payload: uInt8Array}, [uInt8Array.buffer]);
            break;
        case 'sort':
            console.log('sorting array');
            uInt8Array = data.data;
            mergeSort(uInt8Array);
            console.log('waiting 5 seconds');
            setTimeout(self.postMessage.bind(self,
                {
                    result: 'sorted',
                    payload: uInt8Array
                },
                [uInt8Array.buffer]
            ), 5000);
            console.log('sorted array');
            break;
        default:
    }
}, false);

console.log('worker loaded');
