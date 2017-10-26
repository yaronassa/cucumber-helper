## Typedefs

<dl>
<dt><a href="#Location">Location</a> : <code>object</code></dt>
<dd><p>Represents a cucumber pickle location</p>
</dd>
<dt><a href="#Step">Step</a> : <code>object</code></dt>
<dd><p>Represents a cucumber pickle step</p>
</dd>
<dt><a href="#TestCase">TestCase</a> : <code>object</code></dt>
<dd><p>Represents a cucumber pickle (scenario)</p>
</dd>
<dt><a href="#Feature">Feature</a> : <code>object</code></dt>
<dd><p>A reversed engineered feature</p>
</dd>
</dl>

<a name="Location"></a>

## Location : <code>object</code>
Represents a cucumber pickle location

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| line | <code>number</code> | The line in the target file |
| column | <code>number</code> | The column in the target file |

<a name="Step"></a>

## Step : <code>object</code>
Represents a cucumber pickle step

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| arguments | <code>Array.&lt;{content: string, location: Location}&gt;</code> | The step arguments |
| locations | [<code>Array.&lt;Location&gt;</code>](#Location) | The step locations |
| text | <code>string</code> | The step text |

<a name="TestCase"></a>

## TestCase : <code>object</code>
Represents a cucumber pickle (scenario)

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| uri | <code>string</code> | The test case feature URI |
| pickle.language | <code>string</code> | The pickle language signature |
| pickle.name | <code>string</code> | The test case name |
| pickle.steps | [<code>Array.&lt;Step&gt;</code>](#Step) | The test case steps |
| pickle.locations | [<code>Array.&lt;Location&gt;</code>](#Location) | The scenario location |
| pickle.tags | <code>Array.&lt;{name: string, location: Location}&gt;</code> | The test case compounded tags |
| result.result | <code>boolean</code> | The helper end result for this test case |
| result.error_message | <code>string</code> | The helper error message for this test case |

<a name="Feature"></a>

## Feature : <code>object</code>
A reversed engineered feature

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| uri | <code>string</code> | The feature URI |
| scenarios | [<code>Array.&lt;TestCase&gt;</code>](#TestCase) |  |
| fileName | <code>string</code> |  |

