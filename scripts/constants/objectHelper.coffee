angular.module('bicker_router').constant 'ObjectHelper',
  get: (object, path) ->
    return object if path is ''
    pieces = path.split '.'
    key = pieces.pop()
    parent = object

    for segment in pieces
      parent = parent[segment]
      return undefined if parent is undefined

    parent[key]

  set: (object, path, value) ->
    pieces = path.split '.'
    key = pieces.pop()

    parent = object

    for segment in pieces
      if parent[segment] is undefined
        parent[segment] = {}

      parent = parent[segment]

    parent[key] = value

  unset: (object, path) ->
    return object if path is ''
    pieces = path.split '.'
    key = pieces.pop()
    parent = object

    for segment in pieces
      parent = parent[segment]
      return false if parent is undefined

    return false if parent[key] is undefined
    delete parent[key]
    true

  # Recursively return the properties in a that aren't in b
  notIn: (a, b, prefix = '') ->
    notIn = []
    prefix = if prefix.length > 0 then "#{prefix}." else ''

    for key in Object.keys(a)
      thisPath = "#{prefix}#{key}"

      if b[key] is undefined
        notIn.push thisPath

      else if typeof a[key] is 'object' and (not (a[key] instanceof Array))
        notIn = notIn.concat @notIn(a[key], b[key], thisPath)

    notIn

  default: (overrides, defaultSets...) ->
    result = {}

    if defaultSets.length is 1
      defaultSet = defaultSets[0]
    else
      defaultSet = @default defaultSets...

    for key, value of defaultSet
      if value instanceof Array
        result[key] = overrides[key] or value
      else if typeof value is "object" and typeof overrides[key] is "object"
        result[key] = @default overrides[key], value
      else
        result[key] = overrides[key] or value

    for key, value of overrides
      result[key] = result[key] or value

    result

