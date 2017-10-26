## Typedefs

<dl>
<dt><a href="#Location">Location</a> : <code>object</code></dt>
<dd><p>Represents a cucumber pickle location</p>
</dd>
<dt><a href="#HelperResult">HelperResult</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#HelperStep">HelperStep</a> : <code><a href="#Step">Step</a></code></dt>
<dd><p>Represents a helper processed cucumber step</p>
</dd>
<dt><a href="#Step">Step</a> : <code>object</code></dt>
<dd><p>Represents a cucumber pickle step</p>
</dd>
<dt><a href="#HelperTestCase">HelperTestCase</a> : <code><a href="#TestCase">TestCase</a></code></dt>
<dd><p>Represents a helper processed cucumber test case</p>
</dd>
<dt><a href="#TestCase">TestCase</a> : <code>object</code></dt>
<dd><p>Represents a cucumber pickle (scenario)</p>
</dd>
<dt><a href="#HelperFeature">HelperFeature</a> : <code>object</code></dt>
<dd><p>A reversed engineered feature</p>
</dd>
<dt><a href="#HelperRunState">HelperRunState</a> : <code>object</code></dt>
<dd></dd>
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

<a name="HelperResult"></a>

## HelperResult : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| result | <code>boolean</code> | The operation pass/fail status |
| error_message? | <code>string</code> | The operation error message |
| original_result? | <code>object</code> | The original result of the operation |

<a name="HelperStep"></a>

## HelperStep : [<code>Step</code>](#Step)
Represents a helper processed cucumber step

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| result | [<code>HelperResult</code>](#HelperResult) | The step result (appended by the helper) |
| testCase | [<code>HelperTestCase</code>](#HelperTestCase) |  |
| duration | <code>number</code> | The step duration in ms (not guaranteed to be exactly like cucumber) |

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

<a name="HelperTestCase"></a>

## HelperTestCase : [<code>TestCase</code>](#TestCase)
Represents a helper processed cucumber test case

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| feature | [<code>HelperFeature</code>](#HelperFeature) | The feature this test case belongs to |
| result | [<code>HelperResult</code>](#HelperResult) | The test case final result |
| pickle.steps | [<code>Array.&lt;HelperStep&gt;</code>](#HelperStep) | The test case processed steps |
| featureIndex | <code>number</code> | The zero-based index of this test case in its parent feature |
| sameAs | <code>function</code> | Is this test case the same as the tested one |
| duration | <code>number</code> | The step duration in ms (not guaranteed to be exactly like cucumber) |

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

<a name="HelperFeature"></a>

## HelperFeature : <code>object</code>
A reversed engineered feature

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| uri | <code>string</code> |  | The feature URI |
| testCases | [<code>Array.&lt;HelperTestCase&gt;</code>](#HelperTestCase) |  |  |
| fileName | <code>string</code> |  |  |
| uriIndex | <code>number</code> | <code>0</code> | In case a physical feature was split due to tCase manipulation, the uri index of this feature |
| result | [<code>HelperResult</code>](#HelperResult) |  |  |
| sameAs | <code>function</code> |  | Is this feature the same as the tested one |
| duration | <code>number</code> |  | The step duration in ms (not guaranteed to be exactly like cucumber) |

<a name="HelperRunState"></a>

## HelperRunState : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| features | [<code>Array.&lt;HelperFeature&gt;</code>](#HelperFeature) | 
| testCases | [<code>Array.&lt;HelperTestCase&gt;</code>](#HelperTestCase) | 
| currentFeature | [<code>HelperFeature</code>](#HelperFeature) | 
| currentTestCase | [<code>HelperTestCase</code>](#HelperTestCase) | 
| currentStep | [<code>HelperStep</code>](#HelperStep) | 

