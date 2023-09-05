import { EntitiesType } from '@/type/entities.dto';

export const getParamFromUrl = (url: string): Record<string, string> => {
  // Разбиваем строку запроса на отдельные параметры
  const params = new URLSearchParams(url);

  // Создаем пустой объект для хранения параметров
  const paramsObj: Record<string, string> = {};

  // Проходимся по всем параметрам и добавляем их в объект
  params.forEach((value, key) => {
    const keyArr = key?.split('?');

    const keyValue = keyArr.length > 1 ? keyArr[1] : keyArr[0];

    paramsObj[keyValue] = value;
  });

  return paramsObj;
};

export const entitiesForPasteInsert = (
  entities: EntitiesType[],
  idEntities: string
) => {
  const currentEntities = entities.find(item => item?.Id === idEntities);
  const arrNested: EntitiesType[] = [];
  const findNested = (entity: EntitiesType) => {
    const childNestedEntity = entities.filter(
      item => item?.Parent?.Id === entity?.Id
    );
    arrNested.push({
      ...entity,
      isCurrent: entity?.Id === idEntities
    });
    childNestedEntity.length &&
      childNestedEntity.forEach(item => findNested(item));
  };
  findNested(currentEntities);
  return arrNested;
};

export function getUrlParameter(location: string, name: string) {
  name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(location);
  return results === null
    ? ''
    : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export const joinParamArrayApi = (params: string[], nameParam: string) =>
  params.length === 1
    ? `${nameParam}=${params[0]}`
    : params.reduce((acc, currentIdAttr, indexAttr) => {
        if (indexAttr === 0) {
          return `${nameParam}=${currentIdAttr}`;
        }
        return (acc = acc + `&${nameParam}=${currentIdAttr}`);
      }, '');

export const getPercent = (currentCount: number, allCount: number) =>
  +((currentCount * 100) / allCount).toFixed(0);

export const removeExtensionsFromPage = () => {
  const nodes = document.querySelectorAll('#rootContentEntry');
  nodes.forEach(element => {
    element.remove();
  });
  // eslint-disable-next-line no-console
  console.log('extensions remove');
};
