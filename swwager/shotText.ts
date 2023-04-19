// // Получение значений атрибутов объекта и его родителя
// var attrIssueDate = mApi.GetNeosyntezAttributeByKey("issueDate");
// var valueIssueDate = currentObject.Attributes.FirstOrDefault(x => x.Id == attrIssueDate.Id)?.Value.ToObject<DateTime>(); // "Дата выдачи"
// var valueProjectPhase = mApi.GetAttributeValue<NeosyntezAttribute>(parentImportFolder, "projectPhase"); // "Фаза проекта"
// var valueCapitalProjectCode = mApi.GetAttributeValue<NeosyntezAttribute>(parentImportFolder, "capitalProjectCode"); // "Шифр капитального проекта"
// var valueMajorProjectCode = mApi.GetAttributeValue<NeosyntezAttribute>(parentImportFolder, "majorProjectCode"); // "Шифр крупного проекта"

// if (valueIssueDate == null) {
//     mLogger.Info("У текущего объекта \"Док_Папка_импорта\" не заполнен атрибут \"Дата выдачи\".");
//     return GetInfo("", false);
// }
// else if (valueProjectPhase == null) {
//     mLogger.Info("У родительского объекта \"Док_Папка_импорта\" не заполнен атрибут \"Фаза проекта\".");
//     return GetInfo("", false);
// }
// else if (valueCapitalProjectCode == null) {
//     mLogger.Info("У родительского объекта \"Док_Папка_импорта\" не заполнен атрибут \"Шифр капитального проекта\".");
//     return GetInfo("", false);
// }
const fn = () => null
const obgValue = [
    [
        'attrIssueDate',
        !!fn()
    ],
    [
        'valueIssueDate',
        !!('3')
    ],
    [
        'valueProjectPhase',
        !!null
    ],
    [
        'valueCapitalProjectCode',
        !!(5 + 5)
    ]
]
const getErrorText = (obgValue) => {
    for (const item of obgValue) {
        if (!item[1]) {
            return console.log(item[0])
        }
    }
}
getErrorText(obgValue)
