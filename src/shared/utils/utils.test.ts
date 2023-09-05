import { getParamFromUrl } from './utils';

// данные для входа
// https://pdm-kueg.io.neolant.su/structure/entities?id=0ab76d5e-701a-ee11-8db1-e3e987d5ab3c&mode=1&viewer=19a9e12d-9724-438f-9e52-5bb3f342b901
// данные для выхода
// id
// :
// "0ab76d5e-701a-ee11-8db1-e3e987d5ab3c"
// mode
// :
// "1"
// viewer
// :
// "19a9e12d-9724-438f-9e52-5bb3f342b901"
test('getParamFromUrl', () => {
  expect(
    getParamFromUrl(
      'https://pdm-kueg.io.neolant.su/structure/entities?id=0ab76d5e-701a-ee11-8db1-e3e987d5ab3c&mode=1&viewer=19a9e12d-9724-438f-9e52-5bb3f342b901'
    )
  ).toEqual({
    id: '0ab76d5e-701a-ee11-8db1-e3e987d5ab3c',
    mode: '1',
    viewer: '19a9e12d-9724-438f-9e52-5bb3f342b901'
  });
});
