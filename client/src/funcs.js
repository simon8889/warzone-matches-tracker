export function getWarzoneMapByJsonName(map){
    if (map === "mp_don3"){
        return "Verdansk"
    }
    else if (map === "mp_escape2"){
        return "Rebirth Island"
    }
    else{
        return "Other COD Map"
    }
}

export const formatSecondsToMinutes = seconds => Math.floor(seconds / 60) + " Minutes";
export const formatMetersToKilometers = meters => Math.floor(meters / 1000) + " Km";