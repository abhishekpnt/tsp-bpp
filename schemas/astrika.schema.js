const providerSchema =
{
    categories: [
        {
            descriptor: {
                code: "LANGUAGE-COURSES",
                name: "Language Courses"
            },
            id: "LANGUAGE-COURSES"
        },
        {
            id: "SKILL-DEVELOPMENT-COURSES",
            descriptor: {
                code: "SKILL-DEVELOPMENT-COURSES",
                name: "Skill development Courses"
            }
        },
    ],
    descriptor: {
        name: "Astrika",
        short_desc: "Astrika Content",
        images: [
            {
                size_type: "sm",
                url: "https://sunbird.org/images/sunbird-logo-new.png"
            }
        ]
    },
    id: "Astrika",
    items: [
    ],
    fulfillments: [
        {
            agent: {
                person: {
                    name: ""
                },
                contact: {
                    email: ""
                }
            }
        }
    ]
}


const responsePath='result.content'

// const urlPath='http://127.0.0.1:3022/response2.json'

const itemSchema = {
    identifier: 'id',
    code: 'descriptor.id',
    name: 'descriptor.name',
    description: 'descriptor.short_desc',
    createdBy: 'creator.id',
    creator: 'creator.name',
    appIcon: [
      {
        key: 'descriptor.images[]+.url+',
      },
    ],
    posterImage: [
      {
        key: 'descriptor.images[]+.url',
      },
    ],
    'tags[]': [{ key: 'tags.list[].value' }],
  };

const urlConfig = {
    url: 'https://aastrika-stage.tarento.com/apis/public/v8/courseRecommendation/publicSearch/getcourse',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      query: 'asha',
      language: 'en'
    }
  };
module.exports = { providerSchema,responsePath, itemSchema,urlConfig};
