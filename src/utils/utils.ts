import { EntitiesType } from "../type/entities.dto";

export const getParamFromUrl = (url: string): Record<string, string> => {
    // Разбиваем строку запроса на отдельные параметры
    const params = new URLSearchParams(url);

    // Создаем пустой объект для хранения параметров
    const paramsObj: Record<string, string> = {};

    // Проходимся по всем параметрам и добавляем их в объект
    params.forEach((value, key) => {
        const keyArr = key?.split("?")

        const keyValue = keyArr.length > 1 ? keyArr[1] : keyArr[0]

        paramsObj[keyValue] = value;
    });

    return paramsObj
}

export const entitiesForPasteInsert = (entities: EntitiesType[], idEntities: string) => {
    const currentEntities = entities.find(item => item.Id === idEntities)
    const arrNested: EntitiesType[] = []
    const findNested = (entiti: EntitiesType) => {
        const chieldNesrtedEntiti = entities.filter(item => item?.Parent?.Id === entiti?.Id)
        arrNested.push({
            ...entiti,
            isCurrent: entiti.Id === idEntities
        })
        chieldNesrtedEntiti.length && chieldNesrtedEntiti.forEach(item => findNested(item));
    }
    findNested(currentEntities)
    return arrNested
}