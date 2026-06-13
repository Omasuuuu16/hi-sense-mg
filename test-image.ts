import { getSmartPcImage } from './app/lib/image-utils';

const testCases = [
    "Dell Optiplex 3020 i5-4th,8GB,500GB T",
    "Dell Optiplex 3020 i3-4th,4GB,500GB T",
    "Used core i7 ,8,500 T,6TH",
    "HP AMD A6 ,4,250 D VGA2GB",
    "H.D.D PASSPORT 2TB EXT",
    "H.D.D PASSPORT 4TB EXT",
    "USB Wifi",
    "usb wifi",
];

console.log("Running image mapping resolution tests:");
console.log("=========================================");
for (const test of testCases) {
    console.log(`"${test}" -> ${getSmartPcImage(test, 0)}`);
}
