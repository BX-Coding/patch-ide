import usePatchStore from "../../../../store";
import { Thread } from "../../types";

type AutoCompleteOption = {
    id: string,
    label: string
} 

export const useEventList = (thread: Thread): [AutoCompleteOption[], AutoCompleteOption[] | null] => {
    const patchVM = usePatchStore(state => state.patchVM);

    const eventMap = patchVM.getEventLabels();
    const eventList = Object.keys(eventMap).map((event) => {return { id: event, label: eventMap[event] }});

    let eventOptionsList = null;
    if (thread.triggerEvent !== "event_whenbroadcastreceived") {
        const eventOptionMap = patchVM.getEventOptionsMap(thread.triggerEvent) ?? []
        eventOptionsList = eventOptionMap.map((eventOption: string) => { return { id: eventOption, label: eventOption}});
    }

    return [eventList, eventOptionsList];
}