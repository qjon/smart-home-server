# Core

This library was contains list off UI components, pipes and directives used in other Smart Home libraries and projects

## List of content

### Classes

- __DestroyableComponent__ - class contains _onDestroy_ lifecycle function and build-in _destroy$_ property which can be use to unsubscribe subscriptions

### Components

- ___InlineEditComponent___ - component allow to edit inline using _contenteditable_ property
- ___LastUpdateComponent___ - simple component to display last update date or "never"

### Form

#### Directives

- ___LeadingZeroValueDirective___ [riLeadingZeroValue] - directive add leading "zero" if number is lower than 10 (using for time field)
- ___NumberFieldDirective___ [riNumberField] - filter input chars and allow only numeric and dots keys
- ___RangeNumberValue___ [riRangeNumberValue] - allow only values from passing range

#### Fields

- ___DaysFieldComponent___ - days of week form field component
- ___TimeFieldComponent___ - time field form component

#### Pipes

- ___DaysPipe___ (days) - days of week pipe, convert number representing day of week to name: long, medium or short
- ___TimePipe___ (time) - convert object _TimeValue_ to string with leading zeros

### Notifications

- NotificationsService - proxy to any notifications module you use, has two methods:

     - error(title: string, message: string): void 
     - success(title: string, message: string): void
     
## Change Log

### v1.0.0

- start of project  
