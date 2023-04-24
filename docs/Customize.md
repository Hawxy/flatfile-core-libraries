> #### Alpha release
>
> Customizing your Space is not yet available in the SDK. You'll need to call the API directly to perform this task.


## Customize

You can customize the look and feel of your Space with a [theme](#theme) & a [guest sidebar](#guest-sidebar) to toggle on and off features for your Guests.

### Theme
There are two ways to customize a Space. The `useThemeGenerator` hook is the recommended way to customize because you can confirm the colors that are passed in are valid. You can also add overrides manually and modify individual CSS variable that we use in the dashboard.

Make a POST request with the following:
```json http
{
  "method": "post",
  "url": "https://platform.flatfile.com/api/v1/spaces",
  "headers": {
    "Authorization": "Bearer ${accessToken}"
  },

  "body": {
    "spaceConfigId": "string",
    "environmentId": "string",
    "name": "My Space",
    "metadata": {
       "theme": {
        "root": {
          "primaryColor": "red",
          "dangerColor": "maroon",
          "warningColor": "yellow"
        },
        "sidebar": {
          "logo": "https://image.png",
          "textColor": "pink",
          "titleColor": "purple",
          "focusBgColor": "aqua",
          "focusTextColor": "orange",
          "backgroundColor": "yellow",
          "footerTextColor": "white",
          "textUltralightColor": "blue"
        },
        "table": {
          "inputs": {
              "radio": {
                  "color": "blue"
                  },
              "checkbox": {
                  "color": "blue"
              }
          },
          "filters": {
            "color": "yellow",
              "active": {
                "backgroundColor": "purple"
              },
            "error": {
              "activeBackgroundColor": "aqua"
            }
          },
          "column": {
            "header": {
              "fontSize": "16px",
              "backgroundColor": "green",
              "color": "blue",
              "dragHandle": {
                "idle": "yellow",
                "dragging": "blue"
              }
            }
          },
          "fontFamily": "cursive",
          "indexColumn": {
            "backgroundColor": "gray",
            "selected": {
              "color": "gray",
              "backgroundColor": "gray"
            }
          },
          "cell": {
            "selected": {
                "backgroundColor": "gray"
            },
            "active": {
                "borderColor": "gray",
                "spinnerColor": "gray"
            }
          },
          "boolean": {
              "toggleChecked": "gray"
          },
          "loading": {
              "color": "gray"
          }
        },
      }
    }
  }
}
```

#### useThemeGenerator hook

> #### Alpha release
>
> For now, we'll use CodeSandbox to leverage this hook.


The `useThemeGenerator` hook accepts two color values. From there, we programmatically create a nice looking theme for you. If you need more control, add raw values instead. 

**Error handling**: Internally, our hook validates that the colors passed in are valid colors. This means they can be correctly parsed. (Names, rgb, hsv, hex)



| Prop        | Description                              |
| ----------- | ---------------------------------------- |
| `primary`   | `required` **string** ['red']<br/>TODO: something about it |
| `secondary` | `optional` **string** ['blue']<br/>TODO: something about it |

#### Try it out:

https://codesandbox.io/s/flatfile-usethemegeneratorhook-code-only-forked-1vwmn4?file=/src/App.tsx



### Guest sidebar

You can customize your sidebar to hide/show certain elements. Note that this configuration only impacts Guests, not admins. 

Make a POST request with the following:

```json http
{
  "method": "post",
  "url": "https://platform.flatfile.com/api/v1/spaces",

  "body": {
    "spaceConfigId": "string",
    "environmentId": "string",
    "name": "My Space",
    "metadata": {
      "sidebarConfig": {
        "showGuestInvite": true,
        "showDataChecklist": false,
        "showSidebar": true,
      }
    }
  }
}
```

<br/>

| prop                  | description |
| --------------------- | ------------   |
| `showGuestInvite`       |      `optional` **boolean** [false]<br/>TODO: about this     |
| `showDataChecklist`     |      `optional` **boolean** [false]<br/>TODO: about this     |
| `showSidebar`           |      `optional` **boolean** [false]<br/>TODO: about this     |

## Visual Reference

### Sidebar Style
![Sidebar Visual Reference](https://images.ctfassets.net/hjneo4qi4goj/33im4ShO4IJrsPxSJqSXXg/cc89d46f7da3fb1a9a2dca55501c683a/sidebar_theme.png)

### Table Style
![Sidebar Visual Reference](https://images.ctfassets.net/hjneo4qi4goj/4w6wUWR0hKy2WiAxit8PqX/56018d73709f99a42456911a84f2ffa0/table_theme.png)

### Guest Sidebar
![Sidebar Toggles](https://images.ctfassets.net/hjneo4qi4goj/6VhpIyhGSAgcUIhnmvxNke/97e2db61c1af19f29c9290efadaca801/sidebar_config.png)


