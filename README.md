# json-to-object-initializer
Converts JSON string into Object Initializer syntax with JSON.NET types in C#.

## Ex 1: C# - Simple Object

### Input:
> {
  "Name": "Foo",
  "Age": 28
}

### Output:

#### 1. Anonymous type
> new {
  Name = "Foo",
  Age = 28
}

#### 2. With defined type
> new Employee
{
  Name = "Foo",
  Age = 28
}

## Ex 2: C# - Nested Object and JSON.NET types

### Input:
> {
  "Name": "Foo",
  "Age": 28,
  "Teams": [
    "Development",
    "Lead",
    "Testing"
  ]
}

### Output:

> new JObject
{
  new JProperty("Name", "Foo"),
  new JProperty("Age", 28),
  new JProperty("Teams", new JArray("Development", "Lead", "Testing")
}
