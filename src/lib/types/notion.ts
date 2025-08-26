// Notion API types for the blog database structure based on CLAUDE.md schema

export interface NotionPage {
  object: 'page'
  id: string
  created_time: string
  last_edited_time: string
  created_by: {
    object: 'user'
    id: string
  }
  last_edited_by: {
    object: 'user' 
    id: string
  }
  cover: NotionFile | null
  icon: NotionIcon | null
  parent: NotionParent
  archived: boolean
  in_trash: boolean
  properties: NotionPageProperties
  url: string
  public_url?: string | null
}

export interface NotionPageProperties {
  [key: string]: NotionProperty
}

export type NotionProperty =
  | NotionTitleProperty
  | NotionRichTextProperty
  | NotionSelectProperty
  | NotionMultiSelectProperty
  | NotionDateProperty
  | NotionCheckboxProperty
  | NotionNumberProperty
  | NotionFilesProperty
  | NotionRelationProperty

export interface NotionTitleProperty {
  id: string
  type: 'title'
  title: NotionRichTextItem[]
}

export interface NotionRichTextProperty {
  id: string
  type: 'rich_text'
  rich_text: NotionRichTextItem[]
}

export interface NotionSelectProperty {
  id: string
  type: 'select'
  select: NotionSelectOption | null
}

export interface NotionMultiSelectProperty {
  id: string
  type: 'multi_select'
  multi_select: NotionSelectOption[]
}

export interface NotionDateProperty {
  id: string
  type: 'date'
  date: NotionDateValue | null
}

export interface NotionCheckboxProperty {
  id: string
  type: 'checkbox'
  checkbox: boolean
}

export interface NotionNumberProperty {
  id: string
  type: 'number'
  number: number | null
}

export interface NotionFilesProperty {
  id: string
  type: 'files'
  files: NotionFile[]
}

export interface NotionRelationProperty {
  id: string
  type: 'relation'
  relation: NotionRelationItem[]
}

export interface NotionRichTextItem {
  type: 'text' | 'mention' | 'equation'
  text?: {
    content: string
    link?: {
      url: string
    } | null
  }
  mention?: {
    type: 'user' | 'page' | 'database' | 'date' | 'link_preview'
    user?: {
      object: 'user'
      id: string
    }
    page?: {
      id: string
    }
    database?: {
      id: string
    }
    date?: NotionDateValue
    link_preview?: {
      url: string
    }
  }
  equation?: {
    expression: string
  }
  annotations: {
    bold: boolean
    italic: boolean
    strikethrough: boolean
    underline: boolean
    code: boolean
    color: NotionColor
  }
  plain_text: string
  href?: string | null
}

export interface NotionSelectOption {
  id: string
  name: string
  color: NotionColor
}

export interface NotionDateValue {
  start: string
  end?: string | null
  time_zone?: string | null
}

export interface NotionFile {
  name?: string
  type: 'external' | 'file'
  external?: {
    url: string
  }
  file?: {
    url: string
    expiry_time: string
  }
}

export interface NotionIcon {
  type: 'emoji' | 'external' | 'file'
  emoji?: string
  external?: {
    url: string
  }
  file?: {
    url: string
    expiry_time: string
  }
}

export interface NotionParent {
  type: 'database_id' | 'page_id' | 'workspace' | 'block_id'
  database_id?: string
  page_id?: string
  workspace?: true
  block_id?: string
}

export type NotionColor =
  | 'default'
  | 'gray' 
  | 'brown' 
  | 'orange' 
  | 'yellow' 
  | 'green' 
  | 'blue' 
  | 'purple' 
  | 'pink' 
  | 'red'
  | 'gray_background' 
  | 'brown_background' 
  | 'orange_background' 
  | 'yellow_background' 
  | 'green_background' 
  | 'blue_background' 
  | 'purple_background' 
  | 'pink_background' 
  | 'red_background'

export interface NotionRelationItem {
  id: string
}

// Database-specific types
export interface NotionPostPage extends NotionPage {
  properties: {
    Title: NotionTitleProperty
    Slug: NotionRichTextProperty
    Status: NotionSelectProperty
    'Published Date': NotionDateProperty
    Author: NotionRelationProperty
    Category: NotionSelectProperty
    Tags: NotionMultiSelectProperty
    Excerpt: NotionRichTextProperty
    'Featured Image': NotionFilesProperty
    'SEO Title': NotionRichTextProperty
    'SEO Description': NotionRichTextProperty
    'Reading Time': NotionNumberProperty
    Featured: NotionCheckboxProperty
  }
}

export interface NotionAuthorPage extends NotionPage {
  properties: {
    Name: NotionTitleProperty
    Slug: NotionRichTextProperty
    Bio: NotionRichTextProperty
    Avatar: NotionFilesProperty
    Role: NotionRichTextProperty
    'Social Links': NotionRichTextProperty
  }
}

export interface NotionCategoryPage extends NotionPage {
  properties: {
    Name: NotionTitleProperty
    Slug: NotionRichTextProperty
    Description: NotionRichTextProperty
    Color: NotionSelectProperty
    Icon: NotionRichTextProperty
  }
}

// Block types for content
export interface NotionBlock {
  object: 'block'
  id: string
  parent: {
    type: string
    page_id?: string
  }
  created_time: string
  last_edited_time: string
  created_by: {
    object: 'user'
    id: string
  }
  last_edited_by: {
    object: 'user'
    id: string
  }
  archived: boolean
  in_trash: boolean
  has_children: boolean
  type: string
  [key: string]: any
}

export interface NotionDatabase {
  object: 'database'
  id: string
  created_time: string
  last_edited_time: string
  created_by: {
    object: 'user'
    id: string
  }
  last_edited_by: {
    object: 'user'
    id: string
  }
  title: NotionRichTextItem[]
  description: NotionRichTextItem[]
  icon: NotionIcon | null
  cover: NotionFile | null
  properties: Record<string, NotionDatabaseProperty>
  parent: NotionParent
  url: string
  archived: boolean
  is_inline: boolean
  public_url?: string | null
}

// Database Property Configuration Types
export type NotionDatabaseProperty =
  | NotionTitleDatabaseProperty
  | NotionRichTextDatabaseProperty
  | NotionNumberDatabaseProperty
  | NotionSelectDatabaseProperty
  | NotionMultiSelectDatabaseProperty
  | NotionDateDatabaseProperty
  | NotionCheckboxDatabaseProperty
  | NotionUrlDatabaseProperty
  | NotionEmailDatabaseProperty
  | NotionPhoneDatabaseProperty
  | NotionFilesDatabaseProperty
  | NotionRelationDatabaseProperty
  | NotionFormulaDatabaseProperty
  | NotionRollupDatabaseProperty
  | NotionCreatedTimeDatabaseProperty
  | NotionCreatedByDatabaseProperty
  | NotionLastEditedTimeDatabaseProperty
  | NotionLastEditedByDatabaseProperty

export interface NotionTitleDatabaseProperty {
  id: string
  name: string
  type: 'title'
  title: {}
}

export interface NotionRichTextDatabaseProperty {
  id: string
  name: string
  type: 'rich_text'
  rich_text: {}
}

export interface NotionNumberDatabaseProperty {
  id: string
  name: string
  type: 'number'
  number: {
    format: 'number' | 'number_with_commas' | 'percent' | 'dollar' | 'euro' | 'pound' | 'yen'
  }
}

export interface NotionSelectDatabaseProperty {
  id: string
  name: string
  type: 'select'
  select: {
    options: NotionSelectOption[]
  }
}

export interface NotionMultiSelectDatabaseProperty {
  id: string
  name: string
  type: 'multi_select'
  multi_select: {
    options: NotionSelectOption[]
  }
}

export interface NotionDateDatabaseProperty {
  id: string
  name: string
  type: 'date'
  date: {}
}

export interface NotionCheckboxDatabaseProperty {
  id: string
  name: string
  type: 'checkbox'
  checkbox: {}
}

export interface NotionUrlDatabaseProperty {
  id: string
  name: string
  type: 'url'
  url: {}
}

export interface NotionEmailDatabaseProperty {
  id: string
  name: string
  type: 'email'
  email: {}
}

export interface NotionPhoneDatabaseProperty {
  id: string
  name: string
  type: 'phone_number'
  phone_number: {}
}

export interface NotionFilesDatabaseProperty {
  id: string
  name: string
  type: 'files'
  files: {}
}

export interface NotionRelationDatabaseProperty {
  id: string
  name: string
  type: 'relation'
  relation: {
    database_id: string
    type: 'single_property' | 'dual_property'
    single_property?: {}
    dual_property?: {
      synced_property_name: string
      synced_property_id: string
    }
  }
}

export interface NotionFormulaDatabaseProperty {
  id: string
  name: string
  type: 'formula'
  formula: {
    expression: string
  }
}

export interface NotionRollupDatabaseProperty {
  id: string
  name: string
  type: 'rollup'
  rollup: {
    rollup_property_name: string
    relation_property_name: string
    rollup_property_id: string
    relation_property_id: string
    function: 'count' | 'sum' | 'average' | 'median' | 'min' | 'max' | 'range'
  }
}

export interface NotionCreatedTimeDatabaseProperty {
  id: string
  name: string
  type: 'created_time'
  created_time: {}
}

export interface NotionCreatedByDatabaseProperty {
  id: string
  name: string
  type: 'created_by'
  created_by: {}
}

export interface NotionLastEditedTimeDatabaseProperty {
  id: string
  name: string
  type: 'last_edited_time'
  last_edited_time: {}
}

export interface NotionLastEditedByDatabaseProperty {
  id: string
  name: string
  type: 'last_edited_by'
  last_edited_by: {}
}

// Query and Filter Types
export interface NotionDatabaseQuery {
  database_id: string
  filter?: NotionFilter
  sorts?: NotionSort[]
  start_cursor?: string
  page_size?: number
}

export interface NotionFilter {
  and?: NotionFilter[]
  or?: NotionFilter[]
  property?: string
  rich_text?: NotionTextFilter
  number?: NotionNumberFilter
  checkbox?: NotionCheckboxFilter
  select?: NotionSelectFilter
  multi_select?: NotionMultiSelectFilter
  date?: NotionDateFilter
  people?: NotionPeopleFilter
  files?: NotionFilesFilter
  url?: NotionTextFilter
  email?: NotionTextFilter
  phone_number?: NotionTextFilter
  relation?: NotionRelationFilter
  created_time?: NotionDateFilter
  created_by?: NotionPeopleFilter
  last_edited_time?: NotionDateFilter
  last_edited_by?: NotionPeopleFilter
}

export interface NotionTextFilter {
  equals?: string
  does_not_equal?: string
  contains?: string
  does_not_contain?: string
  starts_with?: string
  ends_with?: string
  is_empty?: true
  is_not_empty?: true
}

export interface NotionNumberFilter {
  equals?: number
  does_not_equal?: number
  greater_than?: number
  less_than?: number
  greater_than_or_equal_to?: number
  less_than_or_equal_to?: number
  is_empty?: true
  is_not_empty?: true
}

export interface NotionCheckboxFilter {
  equals?: boolean
  does_not_equal?: boolean
}

export interface NotionSelectFilter {
  equals?: string
  does_not_equal?: string
  is_empty?: true
  is_not_empty?: true
}

export interface NotionMultiSelectFilter {
  contains?: string
  does_not_contain?: string
  is_empty?: true
  is_not_empty?: true
}

export interface NotionDateFilter {
  equals?: string
  before?: string
  after?: string
  on_or_before?: string
  on_or_after?: string
  past_week?: {}
  past_month?: {}
  past_year?: {}
  next_week?: {}
  next_month?: {}
  next_year?: {}
  is_empty?: true
  is_not_empty?: true
}

export interface NotionPeopleFilter {
  contains?: string
  does_not_contain?: string
  is_empty?: true
  is_not_empty?: true
}

export interface NotionFilesFilter {
  is_empty?: true
  is_not_empty?: true
}

export interface NotionRelationFilter {
  contains?: string
  does_not_contain?: string
  is_empty?: true
  is_not_empty?: true
}

export interface NotionSort {
  property?: string
  timestamp?: 'created_time' | 'last_edited_time'
  direction: 'ascending' | 'descending'
}

// Response Types
export interface NotionDatabaseQueryResponse {
  object: 'list'
  results: NotionPage[]
  next_cursor: string | null
  has_more: boolean
  type: 'page_or_database'
  page_or_database: {}
}

export interface NotionSearchResponse {
  object: 'list'
  results: Array<NotionPage | NotionDatabase>
  next_cursor: string | null
  has_more: boolean
  type: 'page_or_database'
  page_or_database: {}
}

export interface NotionBlocksResponse {
  object: 'list'
  results: NotionBlock[]
  next_cursor: string | null
  has_more: boolean
  type: 'block'
  block: {}
}