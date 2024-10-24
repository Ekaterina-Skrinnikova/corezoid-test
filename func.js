function generatedFromSchema(schema, definitions = {}) {
  if (schema.type === "object") {
    let objDate = {};

    for (let key in schema.properties) {
      objDate[key] = generatedFromSchema(schema.properties[key], definitions);
    }

    if (schema.required) {
      schema.required.forEach((key) => {
        if (!objDate[key])
          objDate[key] = generatedFromSchema(
            schema.properties[key],
            definitions
          );
      });
    }

    return objDate;
  } else if (schema.type === "string") {
    return generateRandomString(5);
  } else if (schema.type === "integer") {
    return Math.floor(Math.random() * 100);
  } else if (schema.type === "array") {
    let items = [];

    if (schema.items) {
      const maxAttendees = 7;
      const count = Math.floor(Math.random() * maxAttendees);
      for (let i = 0; i < count; i += 1) {
        items.push(generatedFromSchema(schema.items, definitions));
      }
    }
    return items;
  } else if (schema.enum) {
    let indexRandom = Math.floor(Math.random() * schema.enum.length);
    return schema.enum[indexRandom];
  } else if (schema.anyOf) {
    let indexRandom = Math.floor(Math.random() * schema.anyOf.length);
    return generatedFromSchema(schema.anyOf[indexRandom], definitions);
  } else if (schema.type === "boolean") {
    return Math.random() > 0.5;
  } else if (schema.type === "null") {
    return null;
  }

  if (schema.$ref) {
    const refName = schema.$ref.replace("#", "");
    return generatedFromSchema(definitions[refName], definitions);
  }
}

function generateRandomString(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";

  for (let i = 0; i < length; i += 1) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function test() {
  const schema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    definitions: {
      attendees: {
        type: "object",
        $id: "#attendees",
        properties: {
          userId: {
            type: "integer",
          },
          access: {
            enum: ["view", "modify", "sign", "execute"],
          },
          formAccess: {
            enum: ["view", "execute", "execute_view"],
          },
        },
        required: ["userId", "access"],
      },
    },
    type: "object",
    properties: {
      id: {
        anyOf: [
          {
            type: "string",
          },
          {
            type: "integer",
          },
        ],
      },
      title: {
        type: "string",
      },
      description: {
        type: "string",
      },
      startDate: {
        type: "integer",
      },
      endDate: {
        type: "integer",
      },
      attendees: {
        type: "array",
        items: {
          $ref: "#attendees",
        },
        default: [],
      },
      parentId: {
        anyOf: [
          {
            type: "null",
          },
          {
            type: "string",
          },
          {
            type: "integer",
          },
        ],
      },
      locationId: {
        anyOf: [
          {
            type: "null",
          },
          {
            type: "integer",
          },
        ],
      },
      process: {
        anyOf: [
          {
            type: "null",
          },
          {
            type: "string",
            pattern:
              "https:\\/\\/[a-z]+\\.corezoid\\.com\\/api\\/1\\/json\\/public\\/[0-9]+\\/[0-9a-zA-Z]+",
          },
        ],
      },
      readOnly: {
        type: "boolean",
      },
      priorProbability: {
        anyOf: [
          {
            type: "null",
          },
          {
            type: "integer",
            minimum: 0,
            maximum: 100,
          },
        ],
      },
      channelId: {
        anyOf: [
          {
            type: "null",
          },
          {
            type: "integer",
          },
        ],
      },
      externalId: {
        anyOf: [
          {
            type: "null",
          },
          {
            type: "string",
          },
        ],
      },
      tags: {
        type: "array",
      },
      form: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          viewModel: {
            type: "object",
          },
        },
        required: ["id"],
      },
      formValue: {
        type: "object",
      },
    },
    required: [
      "id",
      "title",
      "description",
      "startDate",
      "endDate",
      "attendees",
    ],
  };

  const generatedData = generatedFromSchema(schema, schema.definitions);

  console.log(generatedData);

  console.assert(
    typeof generatedData.id === "string" ||
      typeof generatedData.id === "number",
    "id має бути string  або number"
  );

  console.assert(
    typeof generatedData.title === "string",
    "title має бути string"
  );

  console.assert(
    typeof generatedData.description === "string",
    "description має бути string"
  );
  console.assert(
    Array.isArray(generatedData.attendees),
    "attendees має бути array"
  );
  console.assert(
    typeof generatedData.startDate === "number",
    "startDate має бути number"
  );
  console.assert(
    typeof generatedData.endDate === "number",
    "endDate має бути number"
  );
}

test();
