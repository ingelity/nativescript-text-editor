# NativescriptDictionary

Text editor app built in Nativescript. Useful for e.g. making your own
dictionary or note files, but in general suitable for any kind of text
files editing.

## Instalation

Either take the NativescriptDictionary.apk and jump to step 4 or do all of the steps.

1) Setup nativescript on your OS (https://docs.nativescript.org/start/quick-setup).
2) From this app's root directory run "npm i" to install required node modules.
3) To generate the app run "npm run build" and then "npm run copy" to
extract the NativescriptDictionary.apk file.
4) Copy the file to your phone where you can click on it to install the app.

## User guide

The app was built with minimalistic UI in mind,
so the input field and buttons are reusable across different actions.

UI components:
  - input field
  - compose button
  - toggle button

On app start enter in the input field the absolute path to the text
file that you wish to open and click on the compose button.

Toggle button is for toggling highlighted words.
If you want to be scrolled back into position that you were at before
showing only highlighted items, please tap on any item prior to tapping
the toggle button (you can simply e.g. highlight it and unhighlight it).
The view will scroll you to that item after you toggle into showing all
of items. This is because Nativescript doesn't yet provide a way to get
the currently visible item in scroll view.

Single tap on line highlights the line.

Double tap on line marks it for deletion. Clicking on compose button
will delete all lines marked for deletion. Double tapping again on
line marked for deletion reverts it back to normal state.

Long press on line copies that line's content and the app then asks you
to enter line number to which you want to copy it.
Tapping toggle button cancels the ongoing copy action.

Creating a new dictionary entry is done by clicking on compose button,
then entering the contents of your new definition into input field and
finally clicking on the line after which you want to insert the new
definition. If you changed your mind and wish to cancel inserting new
definition, click on the compose button again.

Double tap on search input enables you to jump to line number. Just enter
the number of the line that you wish to scroll into view and submit.
Double tapping again cancels the ongoing action.
