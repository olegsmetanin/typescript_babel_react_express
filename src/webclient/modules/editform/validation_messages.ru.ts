export default {

  'allOf'   : '',
  'type'    : 'Невернй тип значения',
  'format'  : 'Неверный формат значения',
  'pattern' : 'Значение не соответствует образцу',

  'instance.id': {
    'type'  : 'Значение должно быть целым положительным числом',
    'format': 'Значение должно быть целым положительным числом',
  },

  'instance.typeCode': {
    'pattern': 'Код типа должен соответствовать образцу (FFE или FFD)'
  }
}