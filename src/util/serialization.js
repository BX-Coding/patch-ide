export default function nothing() {
    return null;
}

export function getBlocksJSON (runtime) {
    json = sb3.serialize(runtime, "");
    console.log(JSON.stringify(json));
    return json;
};