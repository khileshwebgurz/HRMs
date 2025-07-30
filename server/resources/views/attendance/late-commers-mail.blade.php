@include('emails.includes.header')

<p>Hi ,</p>
<br />
<table border="1" cellpadding="5" cellspacing="0" >
	<tr><th>Employee Id</th>
	<th>Clock Time</th>
	<th>Ip Address</th>
	<th>Address</th>
	</tr>
@foreach($fulldata as $fulldata)
 <tr><td>{{$fulldata->name}}</td>
 	<td>{{$fulldata->clock_time}}</td>
 	<td>{{$fulldata->ip_address}}</td>
 	<td>{{$fulldata->address}}</td></tr>
@endforeach
</table>
<style>
	th{
         background-color:#fa5f9d;
         color: white;
	}
</style>
@include('emails.includes.footer')
